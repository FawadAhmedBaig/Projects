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
    public partial class BloodStock : Form
    {
        public BloodStock()
        {
            InitializeComponent();
            ViewBloodStock();
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
        private void ViewBloodStock()
        {
            SqlConnection con = new SqlConnection();
            con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
            String query = "SELECT * FROM BloodTbl";
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

        private void SearchStock()
        {
            if (cmbBlood != null && cmbBlood.SelectedItem != null && !string.IsNullOrWhiteSpace(cmbBlood.SelectedItem.ToString()))
            {
                string selectedBloodGroup = cmbBlood.SelectedItem.ToString().Trim();
                //MessageBox.Show("Selected Blood Group: " + selectedBloodGroup); // Debugging message
                string connectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
                string query = "SELECT * FROM BloodTbl WHERE BGroup = @BloodGroup";

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@BloodGroup", selectedBloodGroup);

                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        DataSet ds = new DataSet();
                        try
                        {
                            connection.Open();
                            adapter.Fill(ds);
                            DataTable dataTable = ds.Tables[0];
                            BloodStockDGV.DataSource = dataTable;
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show("An error occurred: " + ex.Message);
                        }
                    }
                }
            }
            else
            {
                MessageBox.Show("Please select a blood group.");
            }
        }

        private void cmbBlood_SelectedIndexChanged(object sender, EventArgs e)
        {
            String selectedItem = cmbBlood.SelectedItem.ToString().Trim();
            if (selectedItem == "All")
            {
                ViewBloodStock();
            }
            else
            {
                SearchStock();
            }
        }


        private void BloodStock_Load(object sender, EventArgs e)
        {
            ViewBloodStock();
        }

        private void label2_Click(object sender, EventArgs e)
        {
            BloodTransfer BT = new BloodTransfer();
            BT.Show();
            this.Hide();
        }

        private void lblDonor_Click(object sender, EventArgs e)
        {
            Donor donor = new Donor();
            donor.Show();
            this.Hide();
        }

        private void lblDonate_Click(object sender, EventArgs e)
        {
            DonateBlood donate = new DonateBlood();
            donate.Show();
            this.Hide();
        }

        private void lblViewDonors_Click(object sender, EventArgs e)
        {
            ViewDonors view = new ViewDonors();
            view.Show();
            this.Hide();
        }

        private void lblPatient_Click(object sender, EventArgs e)
        {
            Patient p = new Patient();
            p.Show();
            this.Hide();
        }

        private void lblViewPatients_Click(object sender, EventArgs e)
        {
            ViewPatients vp = new ViewPatients();
            vp.Show();
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
            Login login = new Login();
            login.Show();
            this.Hide();
        }
    }
}
