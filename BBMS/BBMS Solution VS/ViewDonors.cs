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
    public partial class ViewDonors : Form
    {
        public ViewDonors()
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
            String query = "SELECT * FROM DonorTbl WHERE DName LIKE '" + txtName.Text + "%'";
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
                dataGridView1.DataSource = DT;

            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }



        }


        private void txtName_TextChanged(object sender, EventArgs e)
        {
            populate();
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

        private void lblPatient_Click(object sender, EventArgs e)
        {
            Patient ob = new Patient();
            ob.Show();
            this.Hide();
        }

        private void lblViewPatients_Click(object sender, EventArgs e)
        {
            ViewPatients ob = new ViewPatients();
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
    }
}
