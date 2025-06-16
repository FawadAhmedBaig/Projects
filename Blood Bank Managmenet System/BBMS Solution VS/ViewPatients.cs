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

namespace BBMS
{
    public partial class ViewPatients : Form
    {
        public ViewPatients()
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
        private void populate()
        {

            SqlConnection con = new SqlConnection();
            con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
            String query = "SELECT * FROM PatientTbl WHERE PName LIKE '" + txtName.Text + "%'";
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
                DataTable DT = ds.Tables[0];
                dataGridView1.DataSource = DT;

            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }

        }
        private void btnSave_Click(object sender, EventArgs e)
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
                    con.ConnectionString = "Data Source=FAWAD-BAIG\\SQLEXPRESS;Initial Catalog=BBMS Database; Integrated Security=True";
                    String query = "UPDATE PatientTbl SET " +
                                    "PName = '" + txtName.Text +
                                    "', PAge = " + txtAge.Text +
                                    ", PPhone = '" + txtPhone.Text +
                                    "', PGender = '" + cmbGender.SelectedItem.ToString() +
                                    "', PBGroup = '" + cmbBloodGroup.SelectedItem.ToString()
                                    + "', PAddress = '" + txtAddress.Text +
                                    "' WHERE PNum = " + key + ";";
                    SqlCommand com = new SqlCommand();
                    com.Connection = con;
                    com.CommandText = query;

                    con.Open();
                    com.ExecuteNonQuery();
                    MessageBox.Show("Patient Updated Succesfully!");
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
        private void Reset()
        {
            foreach (Control con in this.Controls)
            {
                if (con is TextBox && con.Text != "" || con is ComboBox && con.Text != "")
                {
                    con.ResetText();
                    key = 0;
                }
            }
        }

        int key = 0;
        private void delete()
        {
            if (key == 0)
            {
                MessageBox.Show("Please Select the Patient to delete!");
            }
            else
            {
                try
                {

                    SqlConnection con = new SqlConnection();
                    con.ConnectionString = "Data Source=FAWAD-BAIG\\SQLEXPRESS;Initial Catalog=BBMS Database; Integrated Security=True";
                    String query = "DELETE FROM PatientTbl WHERE PNum = " + key + "";
                    SqlCommand com = new SqlCommand();
                    com.Connection = con;
                    com.CommandText = query;

                    con.Open();
                    com.ExecuteNonQuery();
                    MessageBox.Show("Patient Deleted Succesfully!");
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
            delete();
        }
        private void dataGridView1_CellContentClick_2(object sender, DataGridViewCellEventArgs e)
        {
            txtName.Text = dataGridView1[1, dataGridView1.CurrentCell.RowIndex].Value.ToString();
            txtAge.Text = dataGridView1[2, dataGridView1.CurrentCell.RowIndex].Value.ToString();
            txtPhone.Text = dataGridView1[3, dataGridView1.CurrentCell.RowIndex].Value.ToString();
            cmbGender.SelectedItem = dataGridView1[4, dataGridView1.CurrentCell.RowIndex].Value.ToString();
            cmbBloodGroup.SelectedItem = dataGridView1[5, dataGridView1.CurrentCell.RowIndex].Value.ToString();
            txtAddress.Text = dataGridView1[6, dataGridView1.CurrentCell.RowIndex].Value.ToString();

            if (txtName.Text == "")
            {
                key = 0;
            }
            else
            {
                key = Convert.ToInt32(dataGridView1[0, dataGridView1.CurrentCell.RowIndex].Value.ToString());
            }
        }

        private void label5_Click(object sender, EventArgs e)
        {
            Patient P = new Patient();

            P.Show();
            this.Hide();

        }

        private void lblDonor_Click(object sender, EventArgs e)
        {
            Donor ob = new Donor();
            ob.Show();
            this.Hide();
        }

        private void lblDonate_Click(object sender, EventArgs e)
        {
            DonateBlood ob = new DonateBlood();
            ob.Show();
            this.Hide();
        }

        private void lblViewDonors_Click(object sender, EventArgs e)
        {
            ViewDonors ob = new ViewDonors();
            ob.Show();
            this.Hide();
        }

        private void lblBloodStock_Click(object sender, EventArgs e)
        {
            BloodStock ob = new BloodStock();
            ob.Show();
            this.Hide();
        }

        private void lblBloodTransfer_Click(object sender, EventArgs e)
        {
            BloodTransfer ob = new BloodTransfer();
            ob.Show();
            this.Hide();
        }

        private void lblDashboard_Click(object sender, EventArgs e)
        {
            Dashboard ob = new Dashboard();
            ob.Show();
            this.Hide();
        }

        private void lblLogout_Click(object sender, EventArgs e)
        {
            Login ob = new Login();
            ob.Show();
            this.Hide();
        }


        private void dataGridView1_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Delete)
            {
                delete();
            }
        }




    }
}
