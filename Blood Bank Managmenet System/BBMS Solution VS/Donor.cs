using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;
namespace BBMS
{
    public partial class Donor : Form
    {

        public Donor()
        {
            InitializeComponent();
        }
        private void btnDonate_Click(object sender, EventArgs e)
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
                    String query = "INSERT INTO DonorTbl VALUES('" + txtDName.Text + "','" + txtDAge.Text + "','" + cmbDGender.Text + "','" + txtDPhone.Text + "','" + txtDAddress.Text + "','" + cmbDBGroup.Text + "')";
                    SqlCommand com = new SqlCommand();
                    com.Connection = con;
                    com.CommandText = query;

                    con.Open();
                    com.ExecuteNonQuery();
                    MessageBox.Show("Donor Saved Succesfully!");
                    con.Close();
                    Reset();
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }

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
            foreach (Control con in this.Controls)
            {
                if (con is TextBox && con.Text != "" || con is ComboBox && con.Text != "")
                {
                    con.ResetText();
                }
            }
        }

        private void txtDName_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (txtDAge.CanFocus)
                {
                    txtDAge.Focus();
                }
            }
        }

        private void txtDAge_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (cmbDGender.CanFocus)
                {
                    cmbDGender.Focus();
                }
            }
        }

        private void cmbDGender_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (txtDPhone.CanFocus)
                {
                    txtDPhone.Focus();
                }
            }
        }

        private void txtDPhone_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (cmbDBGroup.CanFocus)
                {
                    cmbDBGroup.Focus();
                }
            }
        }

        private void cmbDBGroup_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (txtDAddress.CanFocus)
                {
                    txtDAddress.Focus();
                }
            }
        }

        private void txtDAddress_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                btnSave.PerformClick();
            }
        }

        private void Donor_Load(object sender, EventArgs e)
        {

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
    }
}
