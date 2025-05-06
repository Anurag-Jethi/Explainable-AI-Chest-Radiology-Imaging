import torch
import torchvision.models as models
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torchvision.transforms as transforms

app = Flask(__name__)
CORS(app)

# Define 5-class EfficientNet model
model = models.efficientnet_b0(pretrained=False)
num_ftrs = model.classifier[1].in_features
model.classifier[1] = torch.nn.Linear(num_ftrs, 5)  # 5 output classes

# Load model weights
MODEL_PATH = './models/best_efficientNet_model.pth'
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
state_dict = torch.load(MODEL_PATH, map_location=device)

model.load_state_dict(state_dict)
model.to(device)
model.eval()

# Define class labels
labels = ['Viral Pneumonia', 'Bacterial Pneumonia', 'COVID', 'Tuberculosis', 'Normal']

# Preprocessing pipeline
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def get_prediction(image):
    image_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)

    return predicted.item(), confidence.item()

@app.route('/')
def index():
    return "Welcome to the Chest X-ray Detection API (EfficientNet)! Use /predict to upload an image."

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    image = Image.open(file.stream).convert('RGB')

    label_index, confidence = get_prediction(image)
    label = labels[label_index]

    return jsonify({
        'label': label,
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
