using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace BBMS
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
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

        private void lblLogout_Click(object sender, EventArgs e)
        {
            Login n = new Login();
            n.Show();
            this.Hide();
        }

        private void lblDonor_Click(object sender, EventArgs e)
        {
            Donor donor = new Donor();
            donor.Show();
            this.Hide();
        }

        private void label1_Click(object sender, EventArgs e)
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
            Patient patient = new Patient();
            patient.Show();
            this.Hide();
        }

        private void lblViewPatients_Click(object sender, EventArgs e)
        {
            ViewPatients view = new ViewPatients();
            view.Show();
            this.Hide();
        }

        private void lblBloodStock_Click(object sender, EventArgs e)
        {
            BloodStock blood = new BloodStock();
            blood.Show();
            this.Hide();
        }

        private void lblBloodTransfer_Click(object sender, EventArgs e)
        {
            BloodTransfer bt = new BloodTransfer();
            bt.Show();
            this.Hide();
        }

        private void lblDashboard_Click(object sender, EventArgs e)
        {
            Dashboard d = new Dashboard();
            d.Show();
            this.Hide();
        }

    }
}
