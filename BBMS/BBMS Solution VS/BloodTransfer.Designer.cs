namespace BBMS
{
    partial class BloodTransfer
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(BloodTransfer));
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            pictureBox1 = new PictureBox();
            panel2 = new Panel();
            label1 = new Label();
            label10 = new Label();
            panel1 = new Panel();
            lblDonate = new Label();
            lblBloodStock = new Label();
            lblViewDonors = new Label();
            panel4 = new Panel();
            lblViewPatients = new Label();
            lblDonor = new Label();
            lblPatient = new Label();
            lblLogout = new Label();
            lblDashboard = new Label();
            lblBloodTransfer = new Label();
            cmbPatientId = new ComboBox();
            txtBloodGroup = new TextBox();
            txtPatientName = new TextBox();
            label14 = new Label();
            label12 = new Label();
            label17 = new Label();
            lblAvailableorNot = new Label();
            btnTransfer = new Guna.UI2.WinForms.Guna2TileButton();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            panel2.SuspendLayout();
            panel1.SuspendLayout();
            SuspendLayout();
            // 
            // pictureBox1
            // 
            pictureBox1.Image = (Image)resources.GetObject("pictureBox1.Image");
            pictureBox1.Location = new Point(681, 108);
            pictureBox1.Name = "pictureBox1";
            pictureBox1.Size = new Size(99, 90);
            pictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
            pictureBox1.TabIndex = 26;
            pictureBox1.TabStop = false;
            // 
            // panel2
            // 
            panel2.BackColor = Color.MediumVioletRed;
            panel2.Controls.Add(label1);
            panel2.Dock = DockStyle.Top;
            panel2.Location = new Point(299, 0);
            panel2.Name = "panel2";
            panel2.Size = new Size(841, 55);
            panel2.TabIndex = 24;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Sylfaen", 16F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label1.ForeColor = Color.White;
            label1.Location = new Point(209, 5);
            label1.Name = "label1";
            label1.Size = new Size(459, 42);
            label1.TabIndex = 3;
            label1.Text = "Blood Bank Management System";
            // 
            // label10
            // 
            label10.AutoSize = true;
            label10.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label10.ForeColor = Color.Red;
            label10.Location = new Point(614, 58);
            label10.Name = "label10";
            label10.Size = new Size(243, 47);
            label10.TabIndex = 25;
            label10.Text = "Blood Transfer";
            // 
            // panel1
            // 
            panel1.BackColor = Color.Crimson;
            panel1.Controls.Add(lblDonate);
            panel1.Controls.Add(lblBloodStock);
            panel1.Controls.Add(lblViewDonors);
            panel1.Controls.Add(panel4);
            panel1.Controls.Add(lblViewPatients);
            panel1.Controls.Add(lblDonor);
            panel1.Controls.Add(lblPatient);
            panel1.Controls.Add(lblLogout);
            panel1.Controls.Add(lblDashboard);
            panel1.Controls.Add(lblBloodTransfer);
            panel1.Dock = DockStyle.Left;
            panel1.ForeColor = Color.White;
            panel1.Location = new Point(0, 0);
            panel1.Name = "panel1";
            panel1.Size = new Size(299, 752);
            panel1.TabIndex = 23;
            // 
            // lblDonate
            // 
            lblDonate.AutoSize = true;
            lblDonate.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDonate.ForeColor = Color.White;
            lblDonate.Location = new Point(35, 137);
            lblDonate.Name = "lblDonate";
            lblDonate.Size = new Size(129, 47);
            lblDonate.TabIndex = 9;
            lblDonate.Text = "Donate";
            lblDonate.Click += lblDonate_Click;
            // 
            // lblBloodStock
            // 
            lblBloodStock.AutoSize = true;
            lblBloodStock.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblBloodStock.ForeColor = Color.White;
            lblBloodStock.Location = new Point(36, 417);
            lblBloodStock.Name = "lblBloodStock";
            lblBloodStock.Size = new Size(198, 47);
            lblBloodStock.TabIndex = 7;
            lblBloodStock.Text = "Blood Stock";
            lblBloodStock.Click += label7_Click;
            // 
            // lblViewDonors
            // 
            lblViewDonors.AutoSize = true;
            lblViewDonors.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblViewDonors.ForeColor = Color.White;
            lblViewDonors.Location = new Point(36, 207);
            lblViewDonors.Name = "lblViewDonors";
            lblViewDonors.Size = new Size(219, 47);
            lblViewDonors.TabIndex = 7;
            lblViewDonors.Text = "View Donors";
            lblViewDonors.Click += lblViewDonors_Click;
            // 
            // panel4
            // 
            panel4.BackColor = SystemColors.Menu;
            panel4.ForeColor = Color.Transparent;
            panel4.Location = new Point(16, 482);
            panel4.Name = "panel4";
            panel4.Size = new Size(14, 53);
            panel4.TabIndex = 6;
            // 
            // lblViewPatients
            // 
            lblViewPatients.AutoSize = true;
            lblViewPatients.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblViewPatients.ForeColor = Color.White;
            lblViewPatients.Location = new Point(36, 345);
            lblViewPatients.Name = "lblViewPatients";
            lblViewPatients.Size = new Size(231, 47);
            lblViewPatients.TabIndex = 5;
            lblViewPatients.Text = "View Patients";
            lblViewPatients.Click += lblViewPatients_Click;
            // 
            // lblDonor
            // 
            lblDonor.AutoSize = true;
            lblDonor.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDonor.ForeColor = Color.White;
            lblDonor.Location = new Point(36, 73);
            lblDonor.Name = "lblDonor";
            lblDonor.Size = new Size(116, 47);
            lblDonor.TabIndex = 5;
            lblDonor.Text = "Donor";
            lblDonor.Click += lblDonor_Click;
            // 
            // lblPatient
            // 
            lblPatient.AutoSize = true;
            lblPatient.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblPatient.ForeColor = Color.White;
            lblPatient.Location = new Point(36, 277);
            lblPatient.Name = "lblPatient";
            lblPatient.Size = new Size(128, 47);
            lblPatient.TabIndex = 3;
            lblPatient.Text = "Patient";
            lblPatient.Click += label5_Click;
            // 
            // lblLogout
            // 
            lblLogout.AutoSize = true;
            lblLogout.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblLogout.ForeColor = Color.White;
            lblLogout.Location = new Point(74, 665);
            lblLogout.Name = "lblLogout";
            lblLogout.Size = new Size(124, 47);
            lblLogout.TabIndex = 3;
            lblLogout.Text = "Logout";
            lblLogout.Click += lblLogout_Click;
            // 
            // lblDashboard
            // 
            lblDashboard.AutoSize = true;
            lblDashboard.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDashboard.ForeColor = Color.White;
            lblDashboard.Location = new Point(36, 557);
            lblDashboard.Name = "lblDashboard";
            lblDashboard.Size = new Size(182, 47);
            lblDashboard.TabIndex = 3;
            lblDashboard.Text = "Dashboard";
            lblDashboard.Click += lblDashboard_Click;
            // 
            // lblBloodTransfer
            // 
            lblBloodTransfer.AutoSize = true;
            lblBloodTransfer.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblBloodTransfer.ForeColor = Color.White;
            lblBloodTransfer.Location = new Point(36, 487);
            lblBloodTransfer.Name = "lblBloodTransfer";
            lblBloodTransfer.Size = new Size(243, 47);
            lblBloodTransfer.TabIndex = 3;
            lblBloodTransfer.Text = "Blood Transfer";
            // 
            // cmbPatientId
            // 
            cmbPatientId.Font = new Font("Segoe UI", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            cmbPatientId.FormattingEnabled = true;
            cmbPatientId.Items.AddRange(new object[] { "Male", "Female", "Other" });
            cmbPatientId.Location = new Point(353, 310);
            cmbPatientId.Name = "cmbPatientId";
            cmbPatientId.Size = new Size(225, 40);
            cmbPatientId.TabIndex = 42;
            cmbPatientId.SelectionChangeCommitted += cmbPatientId_SelectionChangeCommitted;
            cmbPatientId.KeyDown += cmbPatientId_KeyDown;
            // 
            // txtBloodGroup
            // 
            txtBloodGroup.Enabled = false;
            txtBloodGroup.Font = new Font("Sylfaen", 12F);
            txtBloodGroup.Location = new Point(891, 312);
            txtBloodGroup.Name = "txtBloodGroup";
            txtBloodGroup.Size = new Size(225, 39);
            txtBloodGroup.TabIndex = 41;
            // 
            // txtPatientName
            // 
            txtPatientName.Enabled = false;
            txtPatientName.Font = new Font("Sylfaen", 12F);
            txtPatientName.Location = new Point(624, 312);
            txtPatientName.Name = "txtPatientName";
            txtPatientName.Size = new Size(234, 39);
            txtPatientName.TabIndex = 40;
            // 
            // label14
            // 
            label14.AutoSize = true;
            label14.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label14.ForeColor = Color.Red;
            label14.Location = new Point(346, 267);
            label14.Name = "label14";
            label14.Size = new Size(112, 31);
            label14.TabIndex = 38;
            label14.Text = "Patient Id";
            // 
            // label12
            // 
            label12.AutoSize = true;
            label12.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label12.ForeColor = Color.Red;
            label12.Location = new Point(886, 267);
            label12.Name = "label12";
            label12.Size = new Size(141, 31);
            label12.TabIndex = 37;
            label12.Text = "Blood Group";
            // 
            // label17
            // 
            label17.AutoSize = true;
            label17.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label17.ForeColor = Color.Red;
            label17.Location = new Point(626, 267);
            label17.Name = "label17";
            label17.Size = new Size(150, 31);
            label17.TabIndex = 39;
            label17.Text = "Patient Name";
            // 
            // lblAvailableorNot
            // 
            lblAvailableorNot.AutoSize = true;
            lblAvailableorNot.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            lblAvailableorNot.ForeColor = Color.Red;
            lblAvailableorNot.Location = new Point(626, 417);
            lblAvailableorNot.Name = "lblAvailableorNot";
            lblAvailableorNot.Size = new Size(185, 31);
            lblAvailableorNot.TabIndex = 39;
            lblAvailableorNot.Text = "AvailableOrNot";
            lblAvailableorNot.Visible = false;
            // 
            // btnTransfer
            // 
            btnTransfer.BackColor = Color.Transparent;
            btnTransfer.BorderColor = Color.Red;
            btnTransfer.BorderRadius = 25;
            btnTransfer.BorderThickness = 1;
            btnTransfer.CustomizableEdges = customizableEdges1;
            btnTransfer.DisabledState.BorderColor = Color.DarkGray;
            btnTransfer.DisabledState.CustomBorderColor = Color.DarkGray;
            btnTransfer.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnTransfer.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnTransfer.FillColor = Color.Red;
            btnTransfer.Font = new Font("Segoe UI", 11F);
            btnTransfer.ForeColor = Color.White;
            btnTransfer.HoverState.BorderColor = Color.Transparent;
            btnTransfer.HoverState.FillColor = Color.Crimson;
            btnTransfer.Location = new Point(644, 505);
            btnTransfer.Name = "btnTransfer";
            btnTransfer.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btnTransfer.Size = new Size(167, 52);
            btnTransfer.TabIndex = 44;
            btnTransfer.Text = "&Transfer";
            btnTransfer.Visible = false;
            btnTransfer.Click += btnTransfer_Click_1;
            // 
            // BloodTransfer
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(1140, 752);
            Controls.Add(btnTransfer);
            Controls.Add(cmbPatientId);
            Controls.Add(txtBloodGroup);
            Controls.Add(txtPatientName);
            Controls.Add(label14);
            Controls.Add(label12);
            Controls.Add(lblAvailableorNot);
            Controls.Add(label17);
            Controls.Add(pictureBox1);
            Controls.Add(panel2);
            Controls.Add(label10);
            Controls.Add(panel1);
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "BloodTransfer";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "BloodTransfer";
            //Load += BloodTransfer_Load;
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            panel2.ResumeLayout(false);
            panel2.PerformLayout();
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private PictureBox pictureBox1;
        private Panel panel2;
        private Label label1;
        private Label label10;
        private Panel panel1;
        private Label lblBloodStock;
        private Label lblViewDonors;
        private Panel panel4;
        private Label lblViewPatients;
        private Label lblDonor;
        private Label lblPatient;
        private Label lblLogout;
        private Label lblDashboard;
        private Label lblBloodTransfer;
        private ComboBox cmbPatientId;
        private TextBox txtBloodGroup;
        private TextBox txtPatientName;
        private Label label14;
        private Label label12;
        private Label label17;
        private Label lblAvailableorNot;
        private Label lblDonate;
        private Guna.UI2.WinForms.Guna2TileButton btnTransfer;
    }
}