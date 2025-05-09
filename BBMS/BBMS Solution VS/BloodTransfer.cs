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
    public partial class BloodTransfer : Form
    {
        public BloodTransfer()
        {
            InitializeComponent();
            fillPatientCb();
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
        private void fillPatientCb()
        {
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True"; conn.Open();
            SqlCommand com = new SqlCommand("SELECT * FROM PatientTbl", conn);
            SqlDataReader rdr = com.ExecuteReader();
            DataTable dt = new DataTable();
            dt.Columns.Add("PNum", typeof(string));
            dt.Load(rdr);
            cmbPatientId.ValueMember = "PNum";
            cmbPatientId.DataSource = dt;
            conn.Close();
        }

        private void GetData()
        {
            SqlConnection con = new SqlConnection();
            con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True"; String query = "SELECT * FROM PatientTbl WHERE PNum = '" + cmbPatientId.SelectedValue.ToString() + "'";
            SqlConnection conn = new SqlConnection();
            SqlCommand com = new SqlCommand();
            com.Connection = con;
            com.CommandText = query;
            SqlDataAdapter DAA = new SqlDataAdapter();
            DataSet ds = new DataSet();
            con.Open();
            DAA.SelectCommand = com;
            DataTable DT = new DataTable();
            DAA.Fill(DT);
            foreach (DataRow dr in DT.Rows)
            {
                txtPatientName.Text = (dr["PName"].ToString());
                txtBloodGroup.Text = (dr["PBGroup"].ToString());

            }
        }
        int stock;
        private void GetStock(String Bgroup)
        {
            SqlConnection con = new SqlConnection();
            con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True"; String query = "SELECT * FROM BloodTbl WHERE BGroup = '" + Bgroup + "'";
            SqlConnection conn = new SqlConnection();
            SqlCommand com = new SqlCommand();
            com.Connection = con;
            com.CommandText = query;
            SqlDataAdapter DAA = new SqlDataAdapter();
            DataSet ds = new DataSet();
            con.Open();
            DAA.SelectCommand = com;
            DataTable DT = new DataTable();
            DAA.Fill(DT);
            foreach (DataRow dr in DT.Rows)
            {
                stock = Convert.ToInt32(dr["BStock"].ToString());

            }
        }
        private void cmbPatientId_SelectionChangeCommitted(object sender, EventArgs e)
        {
            GetData();
            GetStock(txtBloodGroup.Text);
            if (stock > 0)
            {
                btnTransfer.Visible = true;
                lblAvailableorNot.Text = "Available Stock";
                lblAvailableorNot.Visible = true;

            }
            else
            {
                lblAvailableorNot.Visible = true;
                lblAvailableorNot.Text = "Stock not Available";
                btnTransfer.Visible = false;
            }
        }

        private void label5_Click(object sender, EventArgs e)
        {
            Patient patient = new Patient();
            patient.Show();
            this.Hide();
        }
        private void Reset()
        {
            foreach (Control con in this.Controls)
            {
                if (con is TextBox && con.Text != "" || con is ComboBox && con.Text != "")
                {
                    con.ResetText();
                }
            }
        }
        private void UpdateStock()
        {
            int newstock = stock - 1;
            try
            {

                SqlConnection con = new SqlConnection();
                con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True"; String query = "UPDATE BloodTbl SET " +
                                "BStock = '" + newstock +
                                "' WHERE BGroup = '" + txtBloodGroup.Text + "';";
                SqlCommand com = new SqlCommand();
                com.Connection = con;
                com.CommandText = query;

                con.Open();
                com.ExecuteNonQuery();
                con.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        private void btnTransfer_Click_1(object sender, EventArgs e)
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
                    con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True"; String query = "INSERT INTO TransferTbl VALUES('" + txtPatientName.Text + "','" + txtBloodGroup.Text + "');";
                    SqlCommand com = new SqlCommand();
                    com.Connection = con;
                    com.CommandText = query;

                    con.Open();
                    com.ExecuteNonQuery();
                    MessageBox.Show("Succesfull Transfer!");
                    con.Close();

                    GetStock(txtBloodGroup.Text);
                    UpdateStock();
                    Reset();
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
        }
        private void label7_Click(object sender, EventArgs e)
        {
            BloodStock BS = new BloodStock();
            this.Hide();
            BS.Show();
        }

        private void lblDonor_Click(object sender, EventArgs e)
        {
            Donor donor = new Donor();
            donor.Show();
            this.Hide();
        }

        private void lblDonate_Click(object sender, EventArgs e)
        {
            DonateBlood db = new DonateBlood();
            db.Show();
            this.Hide();
        }

        private void lblViewDonors_Click(object sender, EventArgs e)
        {
            ViewDonors view = new ViewDonors();
            view.Show();
            this.Hide();
        }

        private void lblViewPatients_Click(object sender, EventArgs e)
        {
            ViewPatients view = new ViewPatients();
            view.Show();
            this.Hide();
        }

        private void lblDashboard_Click(object sender, EventArgs e)
        {
            Dashboard d = new Dashboard();
            d.Show();
            this.Hide();
        }

        private void lblLogout_Click(object sender, EventArgs e)
        {
            Login l = new Login();
            l.Show();
            this.Hide();
        }

        private void cmbPatientId_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                btnTransfer.PerformClick();
            }
        }
    }

}
