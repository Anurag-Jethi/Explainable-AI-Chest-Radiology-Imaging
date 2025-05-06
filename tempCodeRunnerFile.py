from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torchvision.transforms as transforms
import io
import base64
from lime import lime_image
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the model
MODEL_PATH = r'C:\Users\hp\Downloads\project-bolt-sb1-ebxjejht\project\best_densenet1.pth'
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = torch.load(MODEL_PATH, map_location=device)
model.eval()

# Define image transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def get_prediction(image):
    # Transform image
    image_tensor = transform(image).unsqueeze(0).to(device)
    
    # Get prediction
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)
    
    return predicted.item(), confidence.item()

def generate_lime_explanation(image):
    # Convert PIL image to numpy array
    np_image = np.array(image)
    
    # Create LIME explainer
    explainer = lime_image.LimeImageExplainer()
    
    # Function to get model predictions
    def get_model_predictions(images):
        batch = torch.stack([transform(Image.fromarray(img)) for img in images])
        batch = batch.to(device)
        with torch.no_grad():
            output = model(batch)
            probs = torch.nn.functional.softmax(output, dim=1)
        return probs.cpu().numpy()
    
    # Generate explanation
    explanation = explainer.explain_instance(
        np_image,
        get_model_predictions,
        top_labels=1,
        hide_color=0,
        num_samples=1000
    )
    
    # Get the mask
    temp, mask = explanation.get_image_and_mask(
        explanation.top_labels[0],
        positive_only=True,
        num_features=5,
        hide_rest=True
    )
    
    # Create heatmap overlay
    heatmap = np.uint8(255 * mask)
    colored_heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    result = cv2.addWeighted(np.array(image.convert('RGB')), 0.7, colored_heatmap, 0.3, 0)
    
    # Convert result to base64
    result_image = Image.fromarray(result)
    buffered = io.BytesIO()
    result_image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image from request
        file = request.files['image']
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Get prediction
        label_id, confidence = get_prediction(image)
        label = 'Pneumonia' if label_id == 1 else 'Normal'
        
        # Generate LIME explanation
        explanation_base64 = generate_lime_explanation(image)
        
        return jsonify({
            'label': label,
            'confidence': confidence,
            'explanationUrl': f'data:image/png;base64,{explanation_base64}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)