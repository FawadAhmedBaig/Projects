import pandas as pd
import numpy as np
import warnings
import pickle
warnings.filterwarnings('ignore')


df = pd.read_csv('Loan_Dataset.csv')

#fill the null-values of numerical datatype
df['LoanAmount'] = df['LoanAmount'].fillna(df['LoanAmount'].median())
df['Loan_Amount_Term'] = df['Loan_Amount_Term'].fillna(df['Loan_Amount_Term'].mean())
df['Credit_History'] = df['Credit_History'].fillna(df['Credit_History'].mean())

#fill the null-values of object datatype
df['Gender'] = df['Gender'].fillna(df['Gender'].mode()[0])
df['Married'] = df['Married'].fillna(df['Married'].mode()[0])
df['Dependents'] = df['Dependents'].fillna(df['Dependents'].mode()[0])
df['Self_Employed'] = df['Self_Employed'].fillna(df['Self_Employed'].mode()[0])

# Total Applicant Income
df['Total_Income'] = df['ApplicantIncome'] + df['CoapplicantIncome']

# Applying Log Transformation
df['ApplicantIncomeLog'] = np.log(1 + df['ApplicantIncome'])
df['LoanAmountLog'] = np.log(1 + df['LoanAmount'])
df['Loan_Amount_Term_log'] = np.log(df['Loan_Amount_Term'] + 1)
df['Total_Income_log'] = np.log(df['Total_Income'] + 1)

## drop unnecessary columns
cols = ['ApplicantIncome','CoapplicantIncome','LoanAmount','Loan_Amount_Term','Total_Income','Loan_ID']
df = df.drop(columns = cols, axis = 1)

# Label Ecoding using labelEncoder
from sklearn.preprocessing import LabelEncoder
cols = ['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area', 'Loan_Status']
le = LabelEncoder()
for col in cols:
    df[col] = le.fit_transform(df[col])

# split dataset into Independent and Dependent features
X = df.drop(columns = 'Loan_Status', axis = 1)
Y = df['Loan_Status']

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# The Test Data is imbalanced, So we are gonna balance it
from imblearn.over_sampling import RandomOverSampler
oversample = RandomOverSampler(random_state=42)
X_resampled, Y_resampled = oversample.fit_resample(X,Y)

df_resampled = pd.concat([pd.DataFrame(X_resampled,columns=X.columns),
                          pd.Series(Y_resampled,name="Loan_status")],axis=1)

X_resampled_train, X_resampled_test, Y_resampled_train, Y_resampled_test = train_test_split(X_resampled,Y_resampled,
                                                                                            test_size = 0.25,
                                                                                            random_state=42)
#Random Forest Classifier
rfc = RandomForestClassifier()
rfc.fit(X_resampled_train, Y_resampled_train)

pickle.dump(rfc, open("model.pkl", "wb"))
pickle.dump(le, open('encoder.pkl', 'wb'))



