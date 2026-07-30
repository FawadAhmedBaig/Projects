# Loan Approval System

## Overview
The Loan Approval System is a Machine Learning project that predicts whether a loan should be approved or not based on various customer details. The project includes data exploration and model training using Jupyter Notebooks, as well as a complete web application built with Flask to provide a user interface for predictions.

## Project Structure
The repository is organized into the following main directories and files:

- **`Flask Implementaion/`**: Contains the web application code.
  - `app.py`: The main Flask application script that handles routing and prediction logic.
  - `model.py`: Script used to train the machine learning model (Random Forest Classifier) and save it as a pickle file along with the label encoder.
  - `model.pkl` & `encoder.pkl`: The saved model and encoder used by the Flask app.
  - `templates/`: Contains the HTML templates (e.g., `index.html`) for the web interface.
  - `Loan_Dataset.csv`: The dataset used for training the model within the Flask context.
- **`JupyterNotebook Folder/`**: Contains the Jupyter notebooks for exploratory data analysis (EDA) and model experimentation.
  - `Loan_Approval_Prediction.ipynb`: The main notebook detailing the data preprocessing, visualization, and model building steps.
  - `Loan_Dataset.xls` & `Loan_Test_Dataset.xls`: Datasets used for training and testing the models in the notebooks.
- **`Documentation.pdf`**: Detailed documentation covering the project's background, methodology, and results.

## Technologies Used
- **Programming Language**: Python
- **Web Framework**: Flask
- **Machine Learning**: Scikit-Learn, Imbalanced-Learn (SMOTE/RandomOverSampler)
- **Data Manipulation**: Pandas, NumPy
- **Development Environment**: Jupyter Notebook

## Setup & Installation

### Prerequisites
Make sure you have Python installed on your system. It's recommended to use a virtual environment.

### Steps
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd "Loan Approval System"
   ```

2. **Install the required packages:**
   ```bash
   pip install pandas numpy scikit-learn imbalanced-learn flask
   ```

3. **Train the Model (Optional):**
   The model and encoder are already provided (`model.pkl` and `encoder.pkl`). However, if you want to retrain the model, navigate to the Flask directory and run `model.py`:
   ```bash
   cd "Flask Implementaion"
   python model.py
   ```

4. **Run the Flask App:**
   From inside the `Flask Implementaion` directory, run:
   ```bash
   python app.py
   ```
   The application will start on `http://127.0.0.1:5000/`.

## Usage
1. Open your web browser and go to `http://127.0.0.1:5000/`.
2. Fill in the required applicant details (Gender, Married, Dependents, Education, Income, Loan Amount, etc.).
3. Click on the predict button.
4. The system will display whether the loan is likely to be approved or not based on the provided data.
