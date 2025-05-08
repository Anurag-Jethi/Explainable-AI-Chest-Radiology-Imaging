# 🧠 Explainable AI Chest Radiology Imaging

This is a web-based application for lung disease detection from chest X-ray images using Explainable AI techniques. It combines the power of deep learning models with interpretability tools like Grad-CAM and LIME to provide accurate and understandable medical diagnostics.

## 🚀 Live Demo

- **Frontend (React)**: [https://explainable-ai-chest-radiology.vercel.app](https://explainable-ai-chest-radiology.vercel.app)
- **Backend (Flask + EfficientNet-B0)**: [https://explainable-ai-chest-radiology-imaging.onrender.com](https://explainable-ai-chest-radiology-imaging.onrender.com)

## 🏥 Dataset

The dataset contains **chest X-ray images** categorized into:

- 4 types of **lung diseases**
- 1 category for **normal lungs**

## 🏗️ Project Architecture

- **Frontend**: React (Image upload, result display, visualization)
- **Backend**: Flask + PyTorch (Model inference, Grad-CAM, LIME explainability)
- **Model**: Trained on Chest X-ray Pneumonia dataset using:
  - ResNet-50
  - DenseNet-121
  - ✅ EfficientNet-B0 _(Best performing model)_

## 📷 Features

- Upload chest X-ray images and receive pneumonia detection results.
- Visualize model decisions using:
  - 🔥 **Grad-CAM**: Highlights important regions in the image.
  - 🍋 **LIME**: Explains predictions by perturbing image regions.
- User-friendly web interface for interaction.

## 🧠 Model Training

The models were trained using PyTorch on a chest X-ray pneumonia dataset.

### Models Compared:

| Model              | Accuracy    |
| ------------------ | ----------- |
| ✅ EfficientNet-B0 | **~90.53%** |
| DenseNet-121       | ~89.09%     |
| ResNet-50          | ~87.60%     |

The EfficientNet-B0 model was selected for deployment due to its superior performance and efficiency.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Flask, PyTorch, OpenCV, LIME, Grad-CAM
- **Hosting**:
  - Backend: [Render](https://render.com)
  - Frontend: [Vercel](https://vercel.com)

## 🧪 How to Run Locally

### Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

Uploaded images are processed and then removed securely.

Model loading optimized with torch.no_grad() for inference.

## 📣 Acknowledgements

- [Chest X-ray Pneumonia Dataset (Kaggle)](https://www.kaggle.com/datasets/omkarmanohardalvi/lungs-disease-dataset-4-types?resource=download)

- PyTorch, LIME, Grad-CAM libraries

- Inspiration from open medical AI research
