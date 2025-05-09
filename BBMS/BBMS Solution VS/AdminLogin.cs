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
    public partial class AdminLogin : Form
    {
        public AdminLogin()
        {
            InitializeComponent();
        }

        private void btnAdminLogin_Click_1(object sender, EventArgs e)
        {
            if (txtAdminPassword.Text == "")
            {
                MessageBox.Show("Enter The Admin Password");
            }
            else if (txtAdminPassword.Text == "Password")
            {
                Employee emp = new Employee();
                emp.Show();
                this.Hide();
            }
            else
            {
                MessageBox.Show("Wrong Password! Please Contact The System Admin");
                txtAdminPassword.Text = "";
            }
        }
        private void txtAdminPassword_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (btnAdminLogin.CanFocus)
                {
                    btnAdminLogin.PerformClick();
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

        private void lblCancel_Click(object sender, EventArgs e)
        {
            Login log = new Login();
            log.Show();
            this.Hide();
        }

        private void label5_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

    }
}
