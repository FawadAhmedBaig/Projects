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
    public partial class Login : Form
    {
        public Login()
        {
            InitializeComponent();
        }
        private void btnLogin_Click_1(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection();
            con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
            con.Open();
            SqlDataAdapter sda = new SqlDataAdapter("SELECT count(*) FROM EmployeeTbl where EmpId='" + txtUsername.Text + "' AND EmpPass ='" + txtPassword.Text + "'", con);
            DataTable dt = new DataTable();
            sda.Fill(dt);
            if (dt.Rows[0][0].ToString() == "1")
            {
                MainForm Main = new MainForm();
                Main.Show();
                this.Hide();
                con.Close();
            }
            else
            {
                MessageBox.Show("Wrong Username or Password!");
            }
            con.Close();
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

        private void lblContinueAsAdmin_Click(object sender, EventArgs e)
        {
            AdminLogin admin = new AdminLogin();
            admin.Show();
            this.Hide();
        }

        private void label5_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void txtUsername_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                if (txtPassword.CanFocus)
                {
                    txtPassword.Focus();
                }
            }
        }

        private void txtPassword_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Return)
            {
                btnLogin.PerformClick();
            }
        }

    }
}
