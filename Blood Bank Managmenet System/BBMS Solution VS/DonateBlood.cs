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
    public partial class DonateBlood : Form
    {

        public DonateBlood()
        {
            InitializeComponent();
            populate();
            BloodStock();
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
        int oldstock = 0;
        private void GetStock(String Bgroup)
        {
            SqlConnection con = new SqlConnection();
            con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
            String query = "SELECT * FROM BloodTbl WHERE BGroup = '" + Bgroup + "'";
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
                oldstock = Convert.ToInt32(dr["BStock"].ToString());

            }
        }
        private void populate()
        {

            SqlConnection con = new SqlConnection();
            con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True"; String query = "SELECT * FROM DonorTbl WHERE DName LIKE '" + txtDName.Text + "%'";
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
                DonorsDGV.DataSource = DT;

            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }

        }
        private void BloodStock()
        {
            SqlConnection con = new SqlConnection();
            con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True"; String query = "SELECT * FROM BloodTbl";
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
                BloodStockDGV.DataSource = DT;

            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }

        }

        private void guna2TileButton1_Click(object sender, EventArgs e)
        {
            if (txtDName.Text == "")
            {
                MessageBox.Show("Select a Donor!");
            }
            else
            {
                try
                {
                    int stock = oldstock + 1;
                    SqlConnection con = new SqlConnection();
                    con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
                    String query = "UPDATE BloodTbl SET " +
                                    "BStock = '" + stock +
                                    "' WHERE BGroup = '" + txtBloodGroup.Text + "';";
                    SqlCommand com = new SqlCommand();
                    com.Connection = con;
                    com.CommandText = query;

                    con.Open();
                    com.ExecuteNonQuery();
                    MessageBox.Show("Donation Successfull");
                    con.Close();
                    Reset();
                    populate();
                    BloodStock();
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
        }
        private void DonorsDGV_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            txtDName.Text = DonorsDGV[1, DonorsDGV.CurrentCell.RowIndex].Value.ToString();
            txtBloodGroup.Text = DonorsDGV[6, DonorsDGV.CurrentCell.RowIndex].Value.ToString();
            GetStock(txtBloodGroup.Text);
        }

        private void Reset()
        {
            txtBloodGroup.Text = "";
            txtDName.Text = "";
        }

        private void label3_Click(object sender, EventArgs e)
        {
            Donor donor = new Donor();
            donor.Show();
            this.Hide();
        }

        private void label4_Click(object sender, EventArgs e)
        {
            ViewDonors vd = new ViewDonors();
            vd.Show();
            this.Hide();
        }

        private void label5_Click(object sender, EventArgs e)
        {
            Patient p = new Patient();
            p.Show();
            this.Hide();
        }

        private void label6_Click(object sender, EventArgs e)
        {
            ViewPatients vp = new ViewPatients();
            vp.Show();
            this.Hide();
        }

        private void label7_Click(object sender, EventArgs e)
        {
            BloodStock bs = new BloodStock();
            bs.Show();
            this.Hide();
        }

        private void label2_Click(object sender, EventArgs e)
        {
            BloodTransfer bt = new BloodTransfer();
            bt.Show();
            this.Hide();
        }

        private void label8_Click(object sender, EventArgs e)
        {
            Dashboard d = new Dashboard();
            d.Show();
            this.Hide();
        }

        private void label9_Click(object sender, EventArgs e)
        {
            Login l = new Login();
            l.Show();
            this.Hide();
        }

    }
}
