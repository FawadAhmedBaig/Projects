namespace BBMS
{
    partial class AdminLogin
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(AdminLogin));
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            txtAdminPassword = new TextBox();
            lblPassword = new Label();
            label5 = new Label();
            lblCancel = new Label();
            pictureBox1 = new PictureBox();
            lblTitle = new Label();
            btnAdminLogin = new Guna.UI2.WinForms.Guna2TileButton();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            SuspendLayout();
            // 
            // txtAdminPassword
            // 
            txtAdminPassword.Font = new Font("Bookman Old Style", 12F);
            txtAdminPassword.Location = new Point(212, 236);
            txtAdminPassword.Name = "txtAdminPassword";
            txtAdminPassword.PasswordChar = '*';
            txtAdminPassword.Size = new Size(295, 36);
            txtAdminPassword.TabIndex = 0;
            txtAdminPassword.KeyDown += txtAdminPassword_KeyDown;
            // 
            // lblPassword
            // 
            lblPassword.AutoSize = true;
            lblPassword.Font = new Font("Bookman Old Style", 12F);
            lblPassword.ForeColor = Color.Red;
            lblPassword.Location = new Point(55, 248);
            lblPassword.Name = "lblPassword";
            lblPassword.Size = new Size(123, 27);
            lblPassword.TabIndex = 9;
            lblPassword.Text = "Password";
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.BackColor = Color.White;
            label5.Font = new Font("Bookman Old Style", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label5.ForeColor = Color.Red;
            label5.Location = new Point(630, 9);
            label5.Name = "label5";
            label5.Size = new Size(29, 27);
            label5.TabIndex = 10;
            label5.Text = "X";
            label5.Click += label5_Click;
            // 
            // lblCancel
            // 
            lblCancel.AutoSize = true;
            lblCancel.Font = new Font("Bookman Old Style", 10F, FontStyle.Underline, GraphicsUnit.Point, 0);
            lblCancel.ForeColor = Color.Red;
            lblCancel.Location = new Point(297, 392);
            lblCancel.Name = "lblCancel";
            lblCancel.Size = new Size(77, 23);
            lblCancel.TabIndex = 2;
            lblCancel.Text = "Cancel";
            lblCancel.Click += lblCancel_Click;
            // 
            // pictureBox1
            // 
            pictureBox1.Image = (Image)resources.GetObject("pictureBox1.Image");
            pictureBox1.Location = new Point(286, 72);
            pictureBox1.Name = "pictureBox1";
            pictureBox1.Size = new Size(99, 90);
            pictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
            pictureBox1.TabIndex = 8;
            pictureBox1.TabStop = false;
            // 
            // lblTitle
            // 
            lblTitle.AutoSize = true;
            lblTitle.Font = new Font("Sylfaen", 16F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblTitle.ForeColor = Color.Red;
            lblTitle.Location = new Point(111, 27);
            lblTitle.Name = "lblTitle";
            lblTitle.Size = new Size(459, 42);
            lblTitle.TabIndex = 7;
            lblTitle.Text = "Blood Bank Management System";
            // 
            // btnAdminLogin
            // 
            btnAdminLogin.BackColor = Color.Transparent;
            btnAdminLogin.BorderColor = Color.Red;
            btnAdminLogin.BorderRadius = 25;
            btnAdminLogin.BorderThickness = 1;
            btnAdminLogin.CustomizableEdges = customizableEdges1;
            btnAdminLogin.DisabledState.BorderColor = Color.DarkGray;
            btnAdminLogin.DisabledState.CustomBorderColor = Color.DarkGray;
            btnAdminLogin.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnAdminLogin.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnAdminLogin.FillColor = Color.Red;
            btnAdminLogin.Font = new Font("Segoe UI", 11F);
            btnAdminLogin.ForeColor = Color.White;
            btnAdminLogin.HoverState.BorderColor = Color.Transparent;
            btnAdminLogin.HoverState.FillColor = Color.Crimson;
            btnAdminLogin.Location = new Point(255, 323);
            btnAdminLogin.Name = "btnAdminLogin";
            btnAdminLogin.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btnAdminLogin.Size = new Size(167, 52);
            btnAdminLogin.TabIndex = 27;
            btnAdminLogin.Text = "&Login";
            btnAdminLogin.Click += btnAdminLogin_Click_1;
            // 
            // AdminLogin
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(671, 450);
            Controls.Add(btnAdminLogin);
            Controls.Add(txtAdminPassword);
            Controls.Add(lblPassword);
            Controls.Add(label5);
            Controls.Add(lblCancel);
            Controls.Add(pictureBox1);
            Controls.Add(lblTitle);
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "AdminLogin";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "AdminLogin";
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private TextBox txtAdminPassword;
        private Label lblPassword;
        private Label label5;
        private Label lblCancel;
        private PictureBox pictureBox1;
        private Label lblTitle;
        private Guna.UI2.WinForms.Guna2TileButton btnAdminLogin;
    }
}