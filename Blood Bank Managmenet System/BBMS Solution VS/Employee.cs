using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml.Linq;

namespace BBMS
{
    public partial class Employee : Form
    {
        public Employee()
        {
            InitializeComponent();
            populate();

        }
        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams handleParams = base.CreateParams;
                handleParams.ExStyle |= 0x02000000;
                return handleParams;
            }
        }
        private void Reset()
        {
            EmpNameTb.Text = "";
            EmpPassTb.Text = "";
            key = 0;
        }
        private void populate()
        {

            SqlConnection con = new SqlConnection();
            con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
            String query = "SELECT * FROM EmployeeTbl";
            SqlConnection conn = new SqlConnection();
            SqlCommand com = new SqlCommand();
            com.Connection = con;
            com.CommandText = query;
            SqlDataAdapter DAA = new SqlDataAdapter();
            DataSet ds = new DataSet();
            try
            {
                con.Open();
                DAA.SelectCommand = com;
                DAA.Fill(ds);
                DataTable DT = ds.Tables[0]; //dataset is an array of tables
                EmpDGV.DataSource = DT;
                con.Close();

            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }

        }
        private void btnSave_Click_1(object sender, EventArgs e)
        {
            if (EmpNameTb.Text == "" || EmpPassTb.Text == "")
            {
                MessageBox.Show("Missing Information !");
            }
            else
            {

                Control firstEmptyControl = null;
                foreach (Control con in this.Controls)
                {
                    if ((con is TextBox textBox && textBox.Text == "") ||
                        (con is ComboBox comboBox && (comboBox.Text == "" || comboBox.SelectedIndex == -1)))
                    {
                        if (firstEmptyControl == null || con.TabIndex < firstEmptyControl.TabIndex)
                        {
                            firstEmptyControl = con;
                        }
                    }
                }
                if (firstEmptyControl != null)
                {
                    MessageBox.Show("Please Enter the Required Data!");
                    firstEmptyControl.Focus();
                    return;
                }
                else
                {
                    try
                    {

                        SqlConnection con = new SqlConnection();
                        con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
                        String query = "INSERT INTO EmployeeTbl VALUES('" + EmpNameTb.Text + "','" + EmpPassTb.Text + "')";
                        SqlCommand com = new SqlCommand();
                        com.Connection = con;
                        com.CommandText = query;

                        con.Open();
                        com.ExecuteNonQuery();
                        MessageBox.Show("Employee Saved Succesfully!");
                        con.Close();
                        Reset();
                        populate();

                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message);
                    }
                }

            }
        }

        private void btnEdit_Click(object sender, EventArgs e)
        {
            Control firstEmptyControl = null;
            foreach (Control con in this.Controls)
            {
                if ((con is TextBox textBox && textBox.Text == "") ||
                    (con is ComboBox comboBox && (comboBox.Text == "" || comboBox.SelectedIndex == -1)))
                {
                    if (firstEmptyControl == null || con.TabIndex < firstEmptyControl.TabIndex)
                    {
                        firstEmptyControl = con;
                    }
                }
            }
            if (firstEmptyControl != null)
            {
                MessageBox.Show("Please Enter the Required Data!");
                firstEmptyControl.Focus();
                return;
            }

            else
            {
                try
                {

                    SqlConnection con = new SqlConnection();
                    con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
                    String query = "UPDATE EmployeeTbl SET " +
                                    "EmpId = '" + EmpNameTb.Text +
                                    "', EmpPass = '" + EmpPassTb.Text +
                                    "' WHERE EmpNum = " + key + ";";
                    SqlCommand com = new SqlCommand();
                    com.Connection = con;
                    com.CommandText = query;

                    con.Open();
                    com.ExecuteNonQuery();
                    MessageBox.Show("Employee Updated Succesfully!");
                    con.Close();
                    Reset();
                    populate();
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
        }

        private void btnDelete_Click_1(object sender, EventArgs e)
        {
            if (key == 0)
            {
                MessageBox.Show("Please Select the Employee to delete!");
            }
            else
            {
                try
                {

                    SqlConnection con = new SqlConnection();
                    con.ConnectionString = "Data Source=FAWAD-BAIG\\SQLEXPRESS;Initial Catalog=BBMS Database; Integrated Security=True";
                    String query = "DELETE FROM EmployeeTbl WHERE EmpNum = " + key + "";
                    SqlCommand com = new SqlCommand();
                    com.Connection = con;
                    com.CommandText = query;

                    con.Open();
                    com.ExecuteNonQuery();
                    MessageBox.Show("Employee Deleted Succesfully!");
                    Reset();
                    populate();
                    con.Close();
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
        }


        private void EmpDGV_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            EmpNameTb.Text = EmpDGV[1, EmpDGV.CurrentCell.RowIndex].Value.ToString();
            EmpPassTb.Text = EmpDGV[2, EmpDGV.CurrentCell.RowIndex].Value.ToString();


            if (EmpNameTb.Text == "")
            {
                key = 0;
            }
            else
            {
                key = Convert.ToInt32(EmpDGV[0, EmpDGV.CurrentCell.RowIndex].Value.ToString());
            }
        }


        private void txtDName_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (EmpNameTb.CanFocus)
                {
                    EmpPassTb.Focus();
                }
            }
        }

        int key = 0;

        private void EmpNameTb_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (EmpPassTb.CanFocus)
                {
                    EmpPassTb.Focus();
                }
            }
        }

        private void EmpPassTb_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (btnSave.CanFocus)
                {
                    btnSave.Focus();
                }
            }
        }
        private void label9_Click(object sender, EventArgs e)
        {
            Login log = new Login();
            log.Show();
            this.Hide();
        }


    }
}
