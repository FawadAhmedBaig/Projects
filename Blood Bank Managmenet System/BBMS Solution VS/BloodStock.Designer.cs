namespace BBMS
{
    partial class BloodStock
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(BloodStock));
            DataGridViewCellStyle dataGridViewCellStyle1 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle2 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle3 = new DataGridViewCellStyle();
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
            pictureBox1 = new PictureBox();
            panel2 = new Panel();
            label1 = new Label();
            label10 = new Label();
            BloodStockDGV = new Guna.UI2.WinForms.Guna2DataGridView();
            lblFilter = new Label();
            cmbBlood = new ComboBox();
            panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            panel2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)BloodStockDGV).BeginInit();
            SuspendLayout();
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
            panel1.TabIndex = 11;
            // 
            // lblDonate
            // 
            lblDonate.AutoSize = true;
            lblDonate.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDonate.ForeColor = Color.White;
            lblDonate.Location = new Point(33, 153);
            lblDonate.Name = "lblDonate";
            lblDonate.Size = new Size(129, 47);
            lblDonate.TabIndex = 8;
            lblDonate.Text = "Donate";
            lblDonate.Click += lblDonate_Click;
            // 
            // lblBloodStock
            // 
            lblBloodStock.AutoSize = true;
            lblBloodStock.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblBloodStock.ForeColor = Color.White;
            lblBloodStock.Location = new Point(34, 422);
            lblBloodStock.Name = "lblBloodStock";
            lblBloodStock.Size = new Size(198, 47);
            lblBloodStock.TabIndex = 7;
            lblBloodStock.Text = "Blood Stock";
            // 
            // lblViewDonors
            // 
            lblViewDonors.AutoSize = true;
            lblViewDonors.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblViewDonors.ForeColor = Color.White;
            lblViewDonors.Location = new Point(34, 212);
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
            panel4.Location = new Point(14, 417);
            panel4.Name = "panel4";
            panel4.Size = new Size(14, 53);
            panel4.TabIndex = 6;
            // 
            // lblViewPatients
            // 
            lblViewPatients.AutoSize = true;
            lblViewPatients.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblViewPatients.ForeColor = Color.White;
            lblViewPatients.Location = new Point(34, 350);
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
            lblDonor.Location = new Point(34, 95);
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
            lblPatient.Location = new Point(34, 282);
            lblPatient.Name = "lblPatient";
            lblPatient.Size = new Size(128, 47);
            lblPatient.TabIndex = 3;
            lblPatient.Text = "Patient";
            lblPatient.Click += lblPatient_Click;
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
            lblDashboard.Location = new Point(34, 562);
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
            lblBloodTransfer.Location = new Point(34, 492);
            lblBloodTransfer.Name = "lblBloodTransfer";
            lblBloodTransfer.Size = new Size(243, 47);
            lblBloodTransfer.TabIndex = 3;
            lblBloodTransfer.Text = "Blood Transfer";
            lblBloodTransfer.Click += label2_Click;
            // 
            // pictureBox1
            // 
            pictureBox1.Image = (Image)resources.GetObject("pictureBox1.Image");
            pictureBox1.Location = new Point(681, 108);
            pictureBox1.Name = "pictureBox1";
            pictureBox1.Size = new Size(99, 90);
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
            panel2.TabIndex = 20;
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
            label10.Location = new Point(634, 58);
            label10.Name = "label10";
            label10.Size = new Size(198, 47);
            label10.TabIndex = 21;
            label10.Text = "Blood Stock";
            // 
            // BloodStockDGV
            // 
            dataGridViewCellStyle1.BackColor = Color.White;
            BloodStockDGV.AlternatingRowsDefaultCellStyle = dataGridViewCellStyle1;
            dataGridViewCellStyle2.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = Color.Red;
            dataGridViewCellStyle2.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            dataGridViewCellStyle2.ForeColor = Color.White;
            dataGridViewCellStyle2.SelectionBackColor = Color.Red;
            dataGridViewCellStyle2.SelectionForeColor = SystemColors.HighlightText;
            dataGridViewCellStyle2.WrapMode = DataGridViewTriState.True;
            BloodStockDGV.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle2;
            BloodStockDGV.ColumnHeadersHeight = 29;
            BloodStockDGV.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.EnableResizing;
            dataGridViewCellStyle3.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = Color.White;
            dataGridViewCellStyle3.Font = new Font("Sylfaen", 12F);
            dataGridViewCellStyle3.ForeColor = Color.FromArgb(71, 69, 94);
            dataGridViewCellStyle3.SelectionBackColor = Color.Crimson;
            dataGridViewCellStyle3.SelectionForeColor = Color.White;
            dataGridViewCellStyle3.WrapMode = DataGridViewTriState.False;
            BloodStockDGV.DefaultCellStyle = dataGridViewCellStyle3;
            BloodStockDGV.GridColor = Color.FromArgb(231, 229, 255);
            BloodStockDGV.Location = new Point(381, 302);
            BloodStockDGV.Name = "BloodStockDGV";
            BloodStockDGV.RowHeadersVisible = false;
            BloodStockDGV.RowHeadersWidth = 62;
            BloodStockDGV.Size = new Size(691, 410);
            BloodStockDGV.TabIndex = 24;
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
            //BloodStockDGV.CellContentClick += BloodStockDGV_CellContentClick;
            // 
            // lblFilter
            // 
            lblFilter.AutoSize = true;
            lblFilter.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            lblFilter.ForeColor = Color.Red;
            lblFilter.Location = new Point(400, 253);
            lblFilter.Name = "lblFilter";
            lblFilter.Size = new Size(72, 32);
            lblFilter.TabIndex = 25;
            lblFilter.Text = "Filter";
            // 
            // cmbBlood
            // 
            cmbBlood.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            cmbBlood.ForeColor = Color.Red;
            cmbBlood.FormattingEnabled = true;
            cmbBlood.Items.AddRange(new object[] { "All", "A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-" });
            cmbBlood.Location = new Point(478, 245);
            cmbBlood.Name = "cmbBlood";
            cmbBlood.Size = new Size(206, 40);
            cmbBlood.TabIndex = 26;
            cmbBlood.SelectedIndexChanged += cmbBlood_SelectedIndexChanged;
            // 
            // BloodStock
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(1140, 752);
            Controls.Add(cmbBlood);
            Controls.Add(lblFilter);
            Controls.Add(BloodStockDGV);
            Controls.Add(pictureBox1);
            Controls.Add(panel2);
            Controls.Add(label10);
            Controls.Add(panel1);
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "BloodStock";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "BloodStock";
            Load += BloodStock_Load;
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            panel2.ResumeLayout(false);
            panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)BloodStockDGV).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

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
        private PictureBox pictureBox1;
        private Panel panel2;
        private Label label1;
        private Label label10;
        private Guna.UI2.WinForms.Guna2DataGridView BloodStockDGV;
        private ComboBox cmbBloodGroup;
        private Label lblDonate;
        private Label lblFilter;
        private ComboBox cmbBlood;
    }
}