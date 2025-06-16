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
    public partial class Dashboard : Form
    {
        public Dashboard()
        {
            InitializeComponent();
            GetData();
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
        private void GetData()
        {
            try
            {
                SqlConnection con = new SqlConnection();
                con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
                con.Open();

                SqlDataAdapter sda = new SqlDataAdapter("SELECT count(*) from DonorTbl", con);
                DataTable dt = new DataTable();
                sda.Fill(dt);
                lblDonorNumber.Text = dt.Rows[0][0].ToString();

                SqlDataAdapter saa = new SqlDataAdapter("SELECT count(*) from TransferTbl", con);
                DataTable dt1 = new DataTable();
                saa.Fill(dt1);
                lblTransferNumbers.Text = dt1.Rows[0][0].ToString();

                SqlDataAdapter sda2 = new SqlDataAdapter("SELECT count(*) from EmployeeTbl", con);
                DataTable dt2 = new DataTable();
                sda2.Fill(dt2);
                lblUsersNumber.Text = dt2.Rows[0][0].ToString();

                SqlDataAdapter sda3 = new SqlDataAdapter("SELECT SUM(BStock) from BloodTbl", con);
                DataTable dt3 = new DataTable();
                sda3.Fill(dt3);
                double BStock = Convert.ToDouble(dt3.Rows[0][0].ToString());
                lblTotal.Text = BStock.ToString();

                SqlDataAdapter sda4 = new SqlDataAdapter("SELECT BStock from BloodTbl WHERE BGroup = '" + "O+" + "'", con);
                DataTable dt4 = new DataTable();
                sda4.Fill(dt4);
                lblOplusNum.Text = dt4.Rows[0][0].ToString();
                double OplusPercentage = (Convert.ToDouble(dt4.Rows[0][0].ToString()) / BStock) * 100;
                OPlusProgress.Value = (int)Math.Round(OplusPercentage);

                SqlDataAdapter sda5 = new SqlDataAdapter("SELECT BStock from BloodTbl WHERE BGroup = '" + "AB+" + "'", con);
                DataTable dt5 = new DataTable();
                sda5.Fill(dt5);
                lblABplusNumber.Text = dt5.Rows[0][0].ToString();
                double ABplusPercentage = (Convert.ToDouble(dt5.Rows[0][0].ToString()) / BStock) * 100;
                ABPlusProgress.Value = (int)Math.Round(ABplusPercentage);

                SqlDataAdapter sda6 = new SqlDataAdapter("SELECT BStock from BloodTbl WHERE BGroup = '" + "O-" + "'", con);
                DataTable dt6 = new DataTable();
                sda6.Fill(dt6);
                lblONegNumber.Text = dt6.Rows[0][0].ToString();
                double ONegPercentage = (Convert.ToDouble(dt6.Rows[0][0].ToString()) / BStock) * 100;
                ONegProgress.Value = (int)Math.Round(ONegPercentage);

                SqlDataAdapter sda7 = new SqlDataAdapter("SELECT BStock from BloodTbl WHERE BGroup = '" + "AB-" + "'", con);
                DataTable dt7 = new DataTable();
                sda7.Fill(dt7);
                lblABNegNumber.Text = dt7.Rows[0][0].ToString();
                double ABNegPercentage = (Convert.ToDouble(dt7.Rows[0][0].ToString()) / BStock) * 100;
                ABNegProgress.Value = (int)Math.Round(ABNegPercentage);
                con.Close();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.ToString());
            }
        }
        private void Dashboard_Load(object sender, EventArgs e)
        {
            GetData();
        }

        private void label3_Click(object sender, EventArgs e)
        {
            Donor donor = new Donor();
            this.Hide();
            donor.Show();

        }

        private void lblDonate_Click(object sender, EventArgs e)
        {
            DonateBlood db = new DonateBlood();
            db.Show();
            this.Hide();
        }

        private void lblViewDonors_Click(object sender, EventArgs e)
        {
            ViewDonors vd = new ViewDonors();
            vd.Show();
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

        private void lblBloodStock_Click(object sender, EventArgs e)
        {
            BloodStock bs = new BloodStock();
            bs.Show();
            this.Hide();
        }

        private void lblBloodTransfer_Click(object sender, EventArgs e)
        {
            BloodTransfer bt = new BloodTransfer();
            bt.Show();
            this.Hide();
        }

        private void lblLogout_Click(object sender, EventArgs e)
        {

            Login l = new Login();
            l.Show();
            this.Hide();
        }
    }
}
