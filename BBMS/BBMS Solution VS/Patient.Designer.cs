namespace BBMS
{
    partial class Patient
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Patient));
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            cmbBloodGroup = new ComboBox();
            cmbGender = new ComboBox();
            txtAge = new TextBox();
            txtAddress = new TextBox();
            txtPhone = new TextBox();
            txtName = new TextBox();
            pictureBox1 = new PictureBox();
            panel2 = new Panel();
            label1 = new Label();
            label15 = new Label();
            label14 = new Label();
            label12 = new Label();
            panel1 = new Panel();
            lblBloodStock = new Label();
            lblViewDonors = new Label();
            panel4 = new Panel();
            lblViewPatients = new Label();
            lblDonate = new Label();
            lblDonor = new Label();
            lblPatient = new Label();
            lblLogout = new Label();
            lblDashboard = new Label();
            lblBloodTransfer = new Label();
            label16 = new Label();
            label13 = new Label();
            label11 = new Label();
            label10 = new Label();
            btnSave = new Guna.UI2.WinForms.Guna2TileButton();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            panel2.SuspendLayout();
            panel1.SuspendLayout();
            SuspendLayout();
            // 
            // cmbBloodGroup
            // 
            cmbBloodGroup.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            cmbBloodGroup.ForeColor = Color.Red;
            cmbBloodGroup.FormattingEnabled = true;
            cmbBloodGroup.Items.AddRange(new object[] { "A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-" });
            cmbBloodGroup.Location = new Point(739, 387);
            cmbBloodGroup.Name = "cmbBloodGroup";
            cmbBloodGroup.Size = new Size(225, 39);
            cmbBloodGroup.TabIndex = 4;
            cmbBloodGroup.KeyDown += cmbBloodGroup_KeyDown;
            // 
            // cmbGender
            // 
            cmbGender.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            cmbGender.ForeColor = Color.Red;
            cmbGender.FormattingEnabled = true;
            cmbGender.Items.AddRange(new object[] { "Male", "Female", "Other" });
            cmbGender.Location = new Point(460, 387);
            cmbGender.Name = "cmbGender";
            cmbGender.Size = new Size(225, 39);
            cmbGender.TabIndex = 3;
            cmbGender.KeyDown += cmbGender_KeyDown;
            // 
            // txtAge
            // 
            txtAge.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            txtAge.ForeColor = Color.Red;
            txtAge.Location = new Point(609, 273);
            txtAge.Name = "txtAge";
            txtAge.Size = new Size(235, 39);
            txtAge.TabIndex = 1;
            txtAge.KeyDown += txtAge_KeyDown;
            // 
            // txtAddress
            // 
            txtAddress.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            txtAddress.ForeColor = Color.Red;
            txtAddress.Location = new Point(567, 517);
            txtAddress.Multiline = true;
            txtAddress.Name = "txtAddress";
            txtAddress.Size = new Size(324, 136);
            txtAddress.TabIndex = 5;
            txtAddress.KeyDown += txtAddress_KeyDown;
            // 
            // txtPhone
            // 
            txtPhone.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            txtPhone.ForeColor = Color.Red;
            txtPhone.Location = new Point(869, 273);
            txtPhone.Name = "txtPhone";
            txtPhone.Size = new Size(235, 39);
            txtPhone.TabIndex = 2;
            txtPhone.KeyDown += txtPhone_KeyDown;
            // 
            // txtName
            // 
            txtName.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            txtName.ForeColor = Color.Red;
            txtName.Location = new Point(347, 273);
            txtName.Name = "txtName";
            txtName.Size = new Size(235, 39);
            txtName.TabIndex = 0;
            txtName.KeyDown += txtName_KeyDown;
            // 
            // pictureBox1
            // 
            pictureBox1.Image = (Image)resources.GetObject("pictureBox1.Image");
            pictureBox1.Location = new Point(686, 108);
            pictureBox1.Name = "pictureBox1";
            pictureBox1.Size = new Size(99, 90);
            pictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
            pictureBox1.TabIndex = 19;
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
            panel2.TabIndex = 11;
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
            // label15
            // 
            label15.AutoSize = true;
            label15.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label15.ForeColor = Color.Red;
            label15.Location = new Point(730, 342);
            label15.Name = "label15";
            label15.Size = new Size(141, 31);
            label15.TabIndex = 16;
            label15.Text = "Blood Group";
            // 
            // label14
            // 
            label14.AutoSize = true;
            label14.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label14.ForeColor = Color.Red;
            label14.Location = new Point(451, 342);
            label14.Name = "label14";
            label14.Size = new Size(88, 31);
            label14.TabIndex = 15;
            label14.Text = "Gender";
            // 
            // label12
            // 
            label12.AutoSize = true;
            label12.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label12.ForeColor = Color.Red;
            label12.Location = new Point(609, 228);
            label12.Name = "label12";
            label12.Size = new Size(53, 31);
            label12.TabIndex = 14;
            label12.Text = "Age";
            // 
            // panel1
            // 
            panel1.BackColor = Color.Crimson;
            panel1.Controls.Add(lblBloodStock);
            panel1.Controls.Add(lblViewDonors);
            panel1.Controls.Add(panel4);
            panel1.Controls.Add(lblViewPatients);
            panel1.Controls.Add(lblDonate);
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
            panel1.TabIndex = 10;
            // 
            // lblBloodStock
            // 
            lblBloodStock.AutoSize = true;
            lblBloodStock.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblBloodStock.ForeColor = Color.White;
            lblBloodStock.Location = new Point(40, 433);
            lblBloodStock.Name = "lblBloodStock";
            lblBloodStock.Size = new Size(198, 47);
            lblBloodStock.TabIndex = 7;
            lblBloodStock.Text = "Blood Stock";
            lblBloodStock.Click += lblBloodStock_Click;
            // 
            // lblViewDonors
            // 
            lblViewDonors.AutoSize = true;
            lblViewDonors.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblViewDonors.ForeColor = Color.White;
            lblViewDonors.Location = new Point(40, 223);
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
            panel4.Location = new Point(20, 289);
            panel4.Name = "panel4";
            panel4.Size = new Size(14, 53);
            panel4.TabIndex = 6;
            // 
            // lblViewPatients
            // 
            lblViewPatients.AutoSize = true;
            lblViewPatients.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblViewPatients.ForeColor = Color.White;
            lblViewPatients.Location = new Point(40, 361);
            lblViewPatients.Name = "lblViewPatients";
            lblViewPatients.Size = new Size(231, 47);
            lblViewPatients.TabIndex = 5;
            lblViewPatients.Text = "View Patients";
            lblViewPatients.Click += label6_Click;
            // 
            // lblDonate
            // 
            lblDonate.AutoSize = true;
            lblDonate.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDonate.ForeColor = Color.White;
            lblDonate.Location = new Point(40, 151);
            lblDonate.Name = "lblDonate";
            lblDonate.Size = new Size(129, 47);
            lblDonate.TabIndex = 5;
            lblDonate.Text = "Donate";
            lblDonate.Click += lblDonate_Click;
            // 
            // lblDonor
            // 
            lblDonor.AutoSize = true;
            lblDonor.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDonor.ForeColor = Color.White;
            lblDonor.Location = new Point(40, 82);
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
            lblPatient.Location = new Point(40, 293);
            lblPatient.Name = "lblPatient";
            lblPatient.Size = new Size(128, 47);
            lblPatient.TabIndex = 3;
            lblPatient.Text = "Patient";
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
            lblDashboard.Location = new Point(40, 573);
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
            lblBloodTransfer.Location = new Point(40, 503);
            lblBloodTransfer.Name = "lblBloodTransfer";
            lblBloodTransfer.Size = new Size(243, 47);
            lblBloodTransfer.TabIndex = 3;
            lblBloodTransfer.Text = "Blood Transfer";
            lblBloodTransfer.Click += label2_Click;
            // 
            // label16
            // 
            label16.AutoSize = true;
            label16.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label16.ForeColor = Color.Red;
            label16.Location = new Point(567, 472);
            label16.Name = "label16";
            label16.Size = new Size(95, 31);
            label16.TabIndex = 13;
            label16.Text = "Address";
            // 
            // label13
            // 
            label13.AutoSize = true;
            label13.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label13.ForeColor = Color.Red;
            label13.Location = new Point(869, 228);
            label13.Name = "label13";
            label13.Size = new Size(77, 31);
            label13.TabIndex = 12;
            label13.Text = "Phone";
            // 
            // label11
            // 
            label11.AutoSize = true;
            label11.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label11.ForeColor = Color.Red;
            label11.Location = new Point(347, 228);
            label11.Name = "label11";
            label11.Size = new Size(73, 31);
            label11.TabIndex = 17;
            label11.Text = "Name";
            // 
            // label10
            // 
            label10.AutoSize = true;
            label10.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label10.ForeColor = Color.Red;
            label10.Location = new Point(673, 58);
            label10.Name = "label10";
            label10.Size = new Size(128, 47);
            label10.TabIndex = 18;
            label10.Text = "Patient";
            //label10.Click += label10_Click;
            // 
            // btnSave
            // 
            btnSave.BackColor = Color.Transparent;
            btnSave.BorderColor = Color.Red;
            btnSave.BorderRadius = 25;
            btnSave.BorderThickness = 1;
            btnSave.CustomizableEdges = customizableEdges1;
            btnSave.DisabledState.BorderColor = Color.DarkGray;
            btnSave.DisabledState.CustomBorderColor = Color.DarkGray;
            btnSave.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnSave.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnSave.FillColor = Color.Red;
            btnSave.Font = new Font("Segoe UI", 11F);
            btnSave.ForeColor = Color.White;
            btnSave.HoverState.BorderColor = Color.Transparent;
            btnSave.HoverState.FillColor = Color.Crimson;
            btnSave.Location = new Point(638, 678);
            btnSave.Name = "btnSave";
            btnSave.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btnSave.Size = new Size(167, 52);
            btnSave.TabIndex = 43;
            btnSave.Text = "&Save";
            btnSave.Click += btnSave_Click_1;
            // 
            // Patient
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(1140, 752);
            Controls.Add(btnSave);
            Controls.Add(cmbBloodGroup);
            Controls.Add(cmbGender);
            Controls.Add(txtAge);
            Controls.Add(txtAddress);
            Controls.Add(txtPhone);
            Controls.Add(txtName);
            Controls.Add(pictureBox1);
            Controls.Add(panel2);
            Controls.Add(label15);
            Controls.Add(label14);
            Controls.Add(label12);
            Controls.Add(panel1);
            Controls.Add(label16);
            Controls.Add(label13);
            Controls.Add(label11);
            Controls.Add(label10);
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "Patient";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Patient";
            //Load += Patient_Load;
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            panel2.ResumeLayout(false);
            panel2.PerformLayout();
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private ComboBox cmbBloodGroup;
        private ComboBox cmbGender;
        private TextBox txtAge;
        private TextBox txtAddress;
        private TextBox txtPhone;
        private TextBox txtName;
        private PictureBox pictureBox1;
        private Panel panel2;
        private Label label1;
        private Label label15;
        private Label label14;
        private Label label12;
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
        private Label label16;
        private Label label13;
        private Label label11;
        private Label label10;
        private Label lblDonate;
        private Guna.UI2.WinForms.Guna2TileButton btnSave;
    }
}