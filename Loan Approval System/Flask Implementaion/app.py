from flask import Flask, request, render_template
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)
model = pickle.load(open('model.pkl', 'rb'))
encoder = pickle.load(open('encoder.pkl', 'rb'))

@app.route('/')
def home():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    if request.method ==  'POST':
        gender = request.form['gender']
        married = request.form['married']
        dependents = request.form['dependents']
        education = request.form['education']
        employed = request.form['employed']
        credit = float(request.form['credit'])
        area = request.form['area']
        ApplicantIncome = float(request.form['ApplicantIncome'])
        CoapplicantIncome = float(request.form['CoapplicantIncome'])
        LoanAmount = float(request.form['LoanAmount'])
        Loan_Amount_Term = float(request.form['Loan_Amount_Term'])

        #Creating a new Feature
        TotalIncome = ApplicantIncome + CoapplicantIncome

        #Applying Log Transform
        ApplicantIncomeLog = np.log(1+ ApplicantIncome)
        LoanAmountLog = np.log(1+LoanAmount)
        LoanAmountTermLog = np.log(1+Loan_Amount_Term)
        TotalIncomeLog = np.log(1+TotalIncome)

        # Create a DataFrame for the new loan record
        Features = pd.DataFrame([{
        'Gender': gender,
        'Married': married,
        'Dependents': dependents,
        'Education': education,
        'Self_Employed': employed,
        'Credit_History': credit,
        'Property_Area': area,
        'ApplicantIncomeLog': ApplicantIncomeLog,
        'LoanAmountLog': LoanAmountLog,
        'Loan_Amount_Term_log': LoanAmountTermLog,
        'Total_Income_log': TotalIncomeLog
        }])

        cols = ['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area']
        for col in cols:
            Features[col] = encoder.fit_transform(Features[col])

        prediction = model.predict(Features)

        # print(prediction)

        if(prediction== 0):
            prediction= "No"
        else:
            prediction="Yes"


        return render_template("index.html", prediction_text="loan status is {}".format(prediction))




    else:
        return render_template("index.html")



if __name__ == "__main__":
    app.run(debug=True)