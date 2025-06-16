namespace BBMS
{
    partial class DonateBlood
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(DonateBlood));
            DataGridViewCellStyle dataGridViewCellStyle1 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle2 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle3 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle4 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle5 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle6 = new DataGridViewCellStyle();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            txtDName = new TextBox();
            pictureBox1 = new PictureBox();
            panel2 = new Panel();
            label1 = new Label();
            label15 = new Label();
            panel1 = new Panel();
            lblBloodStock = new Label();
            lblViewDonors = new Label();
            panel3 = new Panel();
            lblViewPatients = new Label();
            lblDonate = new Label();
            lblDonors = new Label();
            lblPatient = new Label();
            lblLogout = new Label();
            lblDashboard = new Label();
            lblBloodTransfer = new Label();
            label10 = new Label();
            label17 = new Label();
            txtBloodGroup = new TextBox();
            DonorsDGV = new Guna.UI2.WinForms.Guna2DataGridView();
            label12 = new Label();
            BloodStockDGV = new Guna.UI2.WinForms.Guna2DataGridView();
            label13 = new Label();
            btnDonate = new Guna.UI2.WinForms.Guna2TileButton();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            panel2.SuspendLayout();
            panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)DonorsDGV).BeginInit();
            ((System.ComponentModel.ISupportInitialize)BloodStockDGV).BeginInit();
            SuspendLayout();
            // 
            // txtDName
            // 
            txtDName.Enabled = false;
            txtDName.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            txtDName.ForeColor = Color.Red;
            txtDName.Location = new Point(466, 598);
            txtDName.Name = "txtDName";
            txtDName.Size = new Size(235, 39);
            txtDName.TabIndex = 7;
            // 
            // pictureBox1
            // 
            pictureBox1.Image = (Image)resources.GetObject("pictureBox1.Image");
            pictureBox1.Location = new Point(781, 58);
            pictureBox1.Name = "pictureBox1";
            pictureBox1.Size = new Size(40, 43);
            pictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
            pictureBox1.TabIndex = 22;
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
            label15.Location = new Point(781, 553);
            label15.Name = "label15";
            label15.Size = new Size(141, 31);
            label15.TabIndex = 15;
            label15.Text = "Blood Group";
            // 
            // panel1
            // 
            panel1.BackColor = Color.Crimson;
            panel1.Controls.Add(lblBloodStock);
            panel1.Controls.Add(lblViewDonors);
            panel1.Controls.Add(panel3);
            panel1.Controls.Add(lblViewPatients);
            panel1.Controls.Add(lblDonate);
            panel1.Controls.Add(lblDonors);
            panel1.Controls.Add(lblPatient);
            panel1.Controls.Add(lblLogout);
            panel1.Controls.Add(lblDashboard);
            panel1.Controls.Add(lblBloodTransfer);
            panel1.Dock = DockStyle.Left;
            panel1.ForeColor = Color.White;
            panel1.Location = new Point(0, 0);
            panel1.Name = "panel1";
            panel1.Size = new Size(299, 752);
            panel1.TabIndex = 9;
            // 
            // lblBloodStock
            // 
            lblBloodStock.AutoSize = true;
            lblBloodStock.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblBloodStock.ForeColor = Color.White;
            lblBloodStock.Location = new Point(40, 402);
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
            lblViewDonors.Location = new Point(40, 132);
            lblViewDonors.Name = "lblViewDonors";
            lblViewDonors.Size = new Size(219, 47);
            lblViewDonors.TabIndex = 7;
            lblViewDonors.Text = "View Donors";
            lblViewDonors.Click += label4_Click;
            // 
            // panel3
            // 
            panel3.BackColor = SystemColors.Menu;
            panel3.ForeColor = Color.Transparent;
            panel3.Location = new Point(20, 197);
            panel3.Name = "panel3";
            panel3.Size = new Size(14, 53);
            panel3.TabIndex = 6;
            // 
            // lblViewPatients
            // 
            lblViewPatients.AutoSize = true;
            lblViewPatients.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblViewPatients.ForeColor = Color.White;
            lblViewPatients.Location = new Point(40, 330);
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
            lblDonate.Location = new Point(40, 197);
            lblDonate.Name = "lblDonate";
            lblDonate.Size = new Size(129, 47);
            lblDonate.TabIndex = 5;
            lblDonate.Text = "Donate";
            // 
            // lblDonors
            // 
            lblDonors.AutoSize = true;
            lblDonors.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDonors.ForeColor = Color.White;
            lblDonors.Location = new Point(40, 68);
            lblDonors.Name = "lblDonors";
            lblDonors.Size = new Size(116, 47);
            lblDonors.TabIndex = 5;
            lblDonors.Text = "Donor";
            lblDonors.Click += label3_Click;
            // 
            // lblPatient
            // 
            lblPatient.AutoSize = true;
            lblPatient.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblPatient.ForeColor = Color.White;
            lblPatient.Location = new Point(40, 262);
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
            lblLogout.Click += label9_Click;
            // 
            // lblDashboard
            // 
            lblDashboard.AutoSize = true;
            lblDashboard.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDashboard.ForeColor = Color.White;
            lblDashboard.Location = new Point(40, 542);
            lblDashboard.Name = "lblDashboard";
            lblDashboard.Size = new Size(182, 47);
            lblDashboard.TabIndex = 3;
            lblDashboard.Text = "Dashboard";
            lblDashboard.Click += label8_Click;
            // 
            // lblBloodTransfer
            // 
            lblBloodTransfer.AutoSize = true;
            lblBloodTransfer.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblBloodTransfer.ForeColor = Color.White;
            lblBloodTransfer.Location = new Point(40, 472);
            lblBloodTransfer.Name = "lblBloodTransfer";
            lblBloodTransfer.Size = new Size(243, 47);
            lblBloodTransfer.TabIndex = 3;
            lblBloodTransfer.Text = "Blood Transfer";
            lblBloodTransfer.Click += label2_Click;
            // 
            // label10
            // 
            label10.AutoSize = true;
            label10.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label10.ForeColor = Color.Red;
            label10.Location = new Point(656, 58);
            label10.Name = "label10";
            label10.Size = new Size(129, 47);
            label10.TabIndex = 20;
            label10.Text = "Donate";
            // 
            // label17
            // 
            label17.AutoSize = true;
            label17.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label17.ForeColor = Color.Red;
            label17.Location = new Point(466, 553);
            label17.Name = "label17";
            label17.Size = new Size(73, 31);
            label17.TabIndex = 17;
            label17.Text = "Name";
            // 
            // txtBloodGroup
            // 
            txtBloodGroup.Enabled = false;
            txtBloodGroup.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            txtBloodGroup.ForeColor = Color.Red;
            txtBloodGroup.Location = new Point(781, 597);
            txtBloodGroup.Name = "txtBloodGroup";
            txtBloodGroup.Size = new Size(235, 39);
            txtBloodGroup.TabIndex = 7;
            // 
            // DonorsDGV
            // 
            dataGridViewCellStyle1.BackColor = Color.White;
            DonorsDGV.AlternatingRowsDefaultCellStyle = dataGridViewCellStyle1;
            dataGridViewCellStyle2.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = Color.Red;
            dataGridViewCellStyle2.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            dataGridViewCellStyle2.ForeColor = Color.White;
            dataGridViewCellStyle2.SelectionBackColor = Color.Red;
            dataGridViewCellStyle2.SelectionForeColor = SystemColors.HighlightText;
            dataGridViewCellStyle2.WrapMode = DataGridViewTriState.True;
            DonorsDGV.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle2;
            DonorsDGV.ColumnHeadersHeight = 29;
            DonorsDGV.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.EnableResizing;
            dataGridViewCellStyle3.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = Color.White;
            dataGridViewCellStyle3.Font = new Font("Sylfaen", 12F);
            dataGridViewCellStyle3.ForeColor = Color.FromArgb(71, 69, 94);
            dataGridViewCellStyle3.SelectionBackColor = Color.Crimson;
            dataGridViewCellStyle3.SelectionForeColor = Color.White;
            dataGridViewCellStyle3.WrapMode = DataGridViewTriState.False;
            DonorsDGV.DefaultCellStyle = dataGridViewCellStyle3;
            DonorsDGV.GridColor = Color.FromArgb(231, 229, 255);
            DonorsDGV.Location = new Point(617, 192);
            DonorsDGV.Name = "DonorsDGV";
            DonorsDGV.RowHeadersVisible = false;
            DonorsDGV.RowHeadersWidth = 62;
            DonorsDGV.Size = new Size(499, 328);
            DonorsDGV.TabIndex = 23;
            DonorsDGV.ThemeStyle.AlternatingRowsStyle.BackColor = Color.White;
            DonorsDGV.ThemeStyle.AlternatingRowsStyle.Font = null;
            DonorsDGV.ThemeStyle.AlternatingRowsStyle.ForeColor = Color.Empty;
            DonorsDGV.ThemeStyle.AlternatingRowsStyle.SelectionBackColor = Color.Empty;
            DonorsDGV.ThemeStyle.AlternatingRowsStyle.SelectionForeColor = Color.Empty;
            DonorsDGV.ThemeStyle.BackColor = Color.White;
            DonorsDGV.ThemeStyle.GridColor = Color.FromArgb(231, 229, 255);
            DonorsDGV.ThemeStyle.HeaderStyle.BackColor = Color.Red;
            DonorsDGV.ThemeStyle.HeaderStyle.BorderStyle = DataGridViewHeaderBorderStyle.None;
            DonorsDGV.ThemeStyle.HeaderStyle.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            DonorsDGV.ThemeStyle.HeaderStyle.ForeColor = Color.White;
            DonorsDGV.ThemeStyle.HeaderStyle.HeaightSizeMode = DataGridViewColumnHeadersHeightSizeMode.EnableResizing;
            DonorsDGV.ThemeStyle.HeaderStyle.Height = 29;
            DonorsDGV.ThemeStyle.ReadOnly = false;
            DonorsDGV.ThemeStyle.RowsStyle.BackColor = Color.White;
            DonorsDGV.ThemeStyle.RowsStyle.BorderStyle = DataGridViewCellBorderStyle.SingleHorizontal;
            DonorsDGV.ThemeStyle.RowsStyle.Font = new Font("Sylfaen", 12F);
            DonorsDGV.ThemeStyle.RowsStyle.ForeColor = Color.FromArgb(71, 69, 94);
            DonorsDGV.ThemeStyle.RowsStyle.Height = 33;
            DonorsDGV.ThemeStyle.RowsStyle.SelectionBackColor = Color.Crimson;
            DonorsDGV.ThemeStyle.RowsStyle.SelectionForeColor = Color.White;
            DonorsDGV.CellContentClick += DonorsDGV_CellContentClick;
            //DonorsDGV.KeyDown += DonorsDGV_KeyDown;
            // 
            // label12
            // 
            label12.AutoSize = true;
            label12.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label12.ForeColor = Color.Red;
            label12.Location = new Point(826, 132);
            label12.Name = "label12";
            label12.Size = new Size(193, 47);
            label12.TabIndex = 24;
            label12.Text = "Donors List";
            // 
            // BloodStockDGV
            // 
            dataGridViewCellStyle4.BackColor = Color.White;
            BloodStockDGV.AlternatingRowsDefaultCellStyle = dataGridViewCellStyle4;
            dataGridViewCellStyle5.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle5.BackColor = Color.Red;
            dataGridViewCellStyle5.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            dataGridViewCellStyle5.ForeColor = Color.White;
            dataGridViewCellStyle5.SelectionBackColor = Color.Red;
            dataGridViewCellStyle5.SelectionForeColor = SystemColors.HighlightText;
            dataGridViewCellStyle5.WrapMode = DataGridViewTriState.True;
            BloodStockDGV.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle5;
            BloodStockDGV.ColumnHeadersHeight = 29;
            BloodStockDGV.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.EnableResizing;
            dataGridViewCellStyle6.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle6.BackColor = Color.White;
            dataGridViewCellStyle6.Font = new Font("Sylfaen", 12F);
            dataGridViewCellStyle6.ForeColor = Color.FromArgb(71, 69, 94);
            dataGridViewCellStyle6.SelectionBackColor = Color.Crimson;
            dataGridViewCellStyle6.SelectionForeColor = Color.White;
            dataGridViewCellStyle6.WrapMode = DataGridViewTriState.False;
            BloodStockDGV.DefaultCellStyle = dataGridViewCellStyle6;
            BloodStockDGV.GridColor = Color.FromArgb(231, 229, 255);
            BloodStockDGV.Location = new Point(340, 192);
            BloodStockDGV.Name = "BloodStockDGV";
            BloodStockDGV.RowHeadersVisible = false;
            BloodStockDGV.RowHeadersWidth = 62;
            BloodStockDGV.Size = new Size(237, 328);
            BloodStockDGV.TabIndex = 23;
            BloodStockDGV.ThemeStyle.AlternatingRowsStyle.BackColor = Color.White;
            BloodStockDGV.ThemeStyle.AlternatingRowsStyle.Font = null;
            BloodStockDGV.ThemeStyle.AlternatingRowsStyle.ForeColor = Color.Empty;
            BloodStockDGV.ThemeStyle.AlternatingRowsStyle.SelectionBackColor = Color.Empty;
            BloodStockDGV.ThemeStyle.AlternatingRowsStyle.SelectionForeColor = Color.Empty;
            BloodStockDGV.ThemeStyle.BackColor = Color.White;
            BloodStockDGV.ThemeStyle.GridColor = Color.FromArgb(231, 229, 255);
            BloodStockDGV.ThemeStyle.HeaderStyle.BackColor = Color.Red;
            BloodStockDGV.ThemeStyle.HeaderStyle.BorderStyle = DataGridViewHeaderBorderStyle.None;
            BloodStockDGV.ThemeStyle.HeaderStyle.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            BloodStockDGV.ThemeStyle.HeaderStyle.ForeColor = Color.White;
            BloodStockDGV.ThemeStyle.HeaderStyle.HeaightSizeMode = DataGridViewColumnHeadersHeightSizeMode.EnableResizing;
            BloodStockDGV.ThemeStyle.HeaderStyle.Height = 29;
            BloodStockDGV.ThemeStyle.ReadOnly = false;
            BloodStockDGV.ThemeStyle.RowsStyle.BackColor = Color.White;
            BloodStockDGV.ThemeStyle.RowsStyle.BorderStyle = DataGridViewCellBorderStyle.SingleHorizontal;
            BloodStockDGV.ThemeStyle.RowsStyle.Font = new Font("Sylfaen", 12F);
            BloodStockDGV.ThemeStyle.RowsStyle.ForeColor = Color.FromArgb(71, 69, 94);
            BloodStockDGV.ThemeStyle.RowsStyle.Height = 33;
            BloodStockDGV.ThemeStyle.RowsStyle.SelectionBackColor = Color.Crimson;
            BloodStockDGV.ThemeStyle.RowsStyle.SelectionForeColor = Color.White;
            BloodStockDGV.CellContentClick += DonorsDGV_CellContentClick;
            // 
            // label13
            // 
            label13.AutoSize = true;
            label13.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label13.ForeColor = Color.Red;
            label13.Location = new Point(340, 132);
            label13.Name = "label13";
            label13.Size = new Size(198, 47);
            label13.TabIndex = 24;
            label13.Text = "Blood Stock";
            // 
            // btnDonate
            // 
            btnDonate.BackColor = Color.Transparent;
            btnDonate.BorderColor = Color.Red;
            btnDonate.BorderRadius = 25;
            btnDonate.BorderThickness = 1;
            btnDonate.CustomizableEdges = customizableEdges1;
            btnDonate.DisabledState.BorderColor = Color.DarkGray;
            btnDonate.DisabledState.CustomBorderColor = Color.DarkGray;
            btnDonate.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnDonate.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnDonate.FillColor = Color.Red;
            btnDonate.Font = new Font("Segoe UI", 11F);
            btnDonate.ForeColor = Color.White;
            btnDonate.HoverState.BorderColor = Color.Transparent;
            btnDonate.HoverState.FillColor = Color.Crimson;
            btnDonate.Location = new Point(654, 665);
            btnDonate.Name = "btnDonate";
            btnDonate.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btnDonate.Size = new Size(167, 52);
            btnDonate.TabIndex = 26;
            btnDonate.Text = "&Donate";
            btnDonate.Click += guna2TileButton1_Click;
            // 
            // DonateBlood
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(1140, 752);
            Controls.Add(btnDonate);
            Controls.Add(label13);
            Controls.Add(BloodStockDGV);
            Controls.Add(label12);
            Controls.Add(DonorsDGV);
            Controls.Add(txtBloodGroup);
            Controls.Add(txtDName);
            Controls.Add(pictureBox1);
            Controls.Add(panel2);
            Controls.Add(label15);
            Controls.Add(label17);
            Controls.Add(panel1);
            Controls.Add(label10);
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "DonateBlood";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "DonateBlood";
            //Load += DonateBlood_Load;
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            panel2.ResumeLayout(false);
            panel2.PerformLayout();
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)DonorsDGV).EndInit();
            ((System.ComponentModel.ISupportInitialize)BloodStockDGV).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private TextBox txtDName;
        private PictureBox pictureBox1;
        private Panel panel2;
        private Label label1;
        private Label label15;
        private Panel panel1;
        private Label lblBloodStock;
        private Label lblViewDonors;
        private Panel panel3;
        private Label lblViewPatients;
        private Label lblDonate;
        private Label lblDonors;
        private Label lblPatient;
        private Label lblLogout;
        private Label lblDashboard;
        private Label lblBloodTransfer;
        private Label label10;
        private Label label17;
        private TextBox txtBloodGroup;
        private Guna.UI2.WinForms.Guna2DataGridView DonorsDGV;
        private Label label12;
        private Guna.UI2.WinForms.Guna2DataGridView BloodStockDGV;
        private Label label13;
        private Guna.UI2.WinForms.Guna2TileButton btnDonate;
    }
}