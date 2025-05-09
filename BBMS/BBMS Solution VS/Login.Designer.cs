namespace BBMS
{
    partial class Login
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Login));
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            lblTitle = new Label();
            pictureBox1 = new PictureBox();
            lblUsername = new Label();
            lblPassword = new Label();
            txtUsername = new TextBox();
            txtPassword = new TextBox();
            lblContinueAsAdmin = new Label();
            label5 = new Label();
            btnLogin = new Guna.UI2.WinForms.Guna2TileButton();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            SuspendLayout();
            // 
            // lblTitle
            // 
            lblTitle.AutoSize = true;
            lblTitle.Font = new Font("Sylfaen", 16F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblTitle.ForeColor = Color.Red;
            lblTitle.Location = new Point(106, 8);
            lblTitle.Name = "lblTitle";
            lblTitle.Size = new Size(459, 42);
            lblTitle.TabIndex = 2;
            lblTitle.Text = "Blood Bank Management System";
            // 
            // pictureBox1
            // 
            pictureBox1.Image = (Image)resources.GetObject("pictureBox1.Image");
            pictureBox1.Location = new Point(281, 53);
            pictureBox1.Name = "pictureBox1";
            pictureBox1.Size = new Size(99, 90);
            pictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
            pictureBox1.TabIndex = 3;
            pictureBox1.TabStop = false;
            // 
            // lblUsername
            // 
            lblUsername.AutoSize = true;
            lblUsername.Font = new Font("Bookman Old Style", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblUsername.ForeColor = Color.Red;
            lblUsername.Location = new Point(50, 183);
            lblUsername.Name = "lblUsername";
            lblUsername.Size = new Size(133, 27);
            lblUsername.TabIndex = 4;
            lblUsername.Text = "Username";
            // 
            // lblPassword
            // 
            lblPassword.AutoSize = true;
            lblPassword.Font = new Font("Bookman Old Style", 12F);
            lblPassword.ForeColor = Color.Red;
            lblPassword.Location = new Point(50, 267);
            lblPassword.Name = "lblPassword";
            lblPassword.Size = new Size(123, 27);
            lblPassword.TabIndex = 4;
            lblPassword.Text = "Password";
            // 
            // txtUsername
            // 
            txtUsername.Font = new Font("Bookman Old Style", 12F);
            txtUsername.HideSelection = false;
            txtUsername.Location = new Point(207, 180);
            txtUsername.Name = "txtUsername";
            txtUsername.Size = new Size(295, 36);
            txtUsername.TabIndex = 0;
            txtUsername.KeyDown += txtUsername_KeyDown;
            // 
            // txtPassword
            // 
            txtPassword.Font = new Font("Bookman Old Style", 12F);
            txtPassword.Location = new Point(207, 255);
            txtPassword.Name = "txtPassword";
            txtPassword.PasswordChar = '*';
            txtPassword.Size = new Size(295, 36);
            txtPassword.TabIndex = 1;
            txtPassword.KeyDown += txtPassword_KeyDown;
            // 
            // lblContinueAsAdmin
            // 
            lblContinueAsAdmin.AutoSize = true;
            lblContinueAsAdmin.Font = new Font("Bookman Old Style", 10F, FontStyle.Underline, GraphicsUnit.Point, 0);
            lblContinueAsAdmin.ForeColor = Color.Red;
            lblContinueAsAdmin.Location = new Point(231, 397);
            lblContinueAsAdmin.Name = "lblContinueAsAdmin";
            lblContinueAsAdmin.Size = new Size(200, 23);
            lblContinueAsAdmin.TabIndex = 3;
            lblContinueAsAdmin.Text = "Continue As Admin";
            lblContinueAsAdmin.Click += lblContinueAsAdmin_Click;
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.BackColor = Color.White;
            label5.Font = new Font("Bookman Old Style", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label5.ForeColor = Color.Red;
            label5.Location = new Point(639, 3);
            label5.Name = "label5";
            label5.Size = new Size(29, 27);
            label5.TabIndex = 4;
            label5.Text = "X";
            label5.Click += label5_Click;
            // 
            // btnLogin
            // 
            btnLogin.BackColor = Color.Transparent;
            btnLogin.BorderColor = Color.Red;
            btnLogin.BorderRadius = 25;
            btnLogin.BorderThickness = 1;
            btnLogin.CustomizableEdges = customizableEdges1;
            btnLogin.DisabledState.BorderColor = Color.DarkGray;
            btnLogin.DisabledState.CustomBorderColor = Color.DarkGray;
            btnLogin.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnLogin.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnLogin.FillColor = Color.Red;
            btnLogin.Font = new Font("Segoe UI", 11F);
            btnLogin.ForeColor = Color.White;
            btnLogin.HoverState.BorderColor = Color.Transparent;
            btnLogin.HoverState.FillColor = Color.Crimson;
            btnLogin.Location = new Point(244, 324);
            btnLogin.Name = "btnLogin";
            btnLogin.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btnLogin.Size = new Size(167, 52);
            btnLogin.TabIndex = 28;
            btnLogin.Text = "&Login";
            btnLogin.Click += btnLogin_Click_1;
            // 
            // Login
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(671, 450);
            Controls.Add(btnLogin);
            Controls.Add(txtPassword);
            Controls.Add(txtUsername);
            Controls.Add(lblPassword);
            Controls.Add(label5);
            Controls.Add(lblContinueAsAdmin);
            Controls.Add(lblUsername);
            Controls.Add(pictureBox1);
            Controls.Add(lblTitle);
            ForeColor = Color.White;
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "Login";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Login";
            //Load += Login_Load;
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label lblTitle;
        private PictureBox pictureBox1;
        private Label lblUsername;
        private Label lblPassword;
        private TextBox txtUsername;
        private TextBox txtPassword;
        private Label lblContinueAsAdmin;
        private Label label5;
        private Guna.UI2.WinForms.Guna2TileButton btnLogin;
    }
}