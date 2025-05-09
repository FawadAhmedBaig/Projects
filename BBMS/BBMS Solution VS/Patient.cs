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
    public partial class Patient : Form
    {
        public Patient()
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
        private void btnSave_Click_1(object sender, EventArgs e)
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
                    String query = "INSERT INTO PatientTbl VALUES('" + txtName.Text + "','" + txtAge.Text + "','" + txtPhone.Text + "','" + cmbGender.SelectedItem.ToString() + "','" + cmbBloodGroup.SelectedItem.ToString() + "','" + txtAddress.Text + "')";
                    SqlCommand com = new SqlCommand();
                    com.Connection = con;
                    com.CommandText = query;

                    con.Open();
                    com.ExecuteNonQuery();
                    MessageBox.Show("Patient Saved Succesfully!");
                    con.Close();
                    Reset();
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
                }
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {

        }

        private void txtName_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (txtAge.CanFocus)
                {
                    txtAge.Focus();
                }
            }
        }

        private void txtAge_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (txtPhone.CanFocus)
                {
                    txtPhone.Focus();
                }
            }
        }

        private void txtPhone_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (cmbGender.CanFocus)
                {
                    cmbGender.Focus();
                }
            }
        }

        private void cmbGender_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (cmbBloodGroup.CanFocus)
                {
                    cmbBloodGroup.Focus();
                }
            }
        }

        private void cmbBloodGroup_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (txtAddress.CanFocus)
                {
                    txtAddress.Focus();
                }
            }
        }

        private void txtAddress_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {

                btnSave.PerformClick();

            }
        }

        private void label6_Click(object sender, EventArgs e)
        {
            ViewPatients VP = new ViewPatients();

            VP.Show();
            this.Hide();
        }

        private void label2_Click(object sender, EventArgs e)
        {
            BloodTransfer bt = new BloodTransfer();
            this.Hide();
            bt.Show();
        }

        private void lblDonor_Click(object sender, EventArgs e)
        {
            Donor d = new Donor();
            d.Show();
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
            ViewDonors vd = new ViewDonors();
            vd.Show();
            this.Hide();
        }

        private void lblBloodStock_Click(object sender, EventArgs e)
        {
            BloodStock bs = new BloodStock();
            bs.Show();
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
