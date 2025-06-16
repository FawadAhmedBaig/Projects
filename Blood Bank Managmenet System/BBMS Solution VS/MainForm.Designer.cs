namespace BBMS
{
    partial class MainForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            panel1 = new Panel();
            lblBloodStock = new Label();
            lblViewDonors = new Label();
            lblViewPatients = new Label();
            label1 = new Label();
            lblDonor = new Label();
            lblPatient = new Label();
            lblLogout = new Label();
            lblDashboard = new Label();
            lblBloodTransfer = new Label();
            panel2 = new Panel();
            lblTitle = new Label();
            pbMainImage = new PictureBox();
            panel1.SuspendLayout();
            panel2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)pbMainImage).BeginInit();
            SuspendLayout();
            // 
            // panel1
            // 
            panel1.BackColor = Color.Crimson;
            panel1.Controls.Add(lblBloodStock);
            panel1.Controls.Add(lblViewDonors);
            panel1.Controls.Add(lblViewPatients);
            panel1.Controls.Add(label1);
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
            panel1.TabIndex = 0;
            // 
            // lblBloodStock
            // 
            lblBloodStock.AutoSize = true;
            lblBloodStock.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblBloodStock.ForeColor = Color.White;
            lblBloodStock.Location = new Point(23, 434);
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
            lblViewDonors.Location = new Point(23, 224);
            lblViewDonors.Name = "lblViewDonors";
            lblViewDonors.Size = new Size(219, 47);
            lblViewDonors.TabIndex = 7;
            lblViewDonors.Text = "View Donors";
            lblViewDonors.Click += lblViewDonors_Click;
            // 
            // lblViewPatients
            // 
            lblViewPatients.AutoSize = true;
            lblViewPatients.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblViewPatients.ForeColor = Color.White;
            lblViewPatients.Location = new Point(23, 362);
            lblViewPatients.Name = "lblViewPatients";
            lblViewPatients.Size = new Size(231, 47);
            lblViewPatients.TabIndex = 5;
            lblViewPatients.Text = "View Patients";
            lblViewPatients.Click += lblViewPatients_Click;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label1.ForeColor = Color.White;
            label1.Location = new Point(23, 157);
            label1.Name = "label1";
            label1.Size = new Size(129, 47);
            label1.TabIndex = 5;
            label1.Text = "Donate";
            label1.Click += label1_Click;
            // 
            // lblDonor
            // 
            lblDonor.AutoSize = true;
            lblDonor.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDonor.ForeColor = Color.White;
            lblDonor.Location = new Point(23, 87);
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
            lblPatient.Location = new Point(23, 294);
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
            lblDashboard.Location = new Point(23, 574);
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
            lblBloodTransfer.Location = new Point(23, 504);
            lblBloodTransfer.Name = "lblBloodTransfer";
            lblBloodTransfer.Size = new Size(243, 47);
            lblBloodTransfer.TabIndex = 3;
            lblBloodTransfer.Text = "Blood Transfer";
            lblBloodTransfer.Click += lblBloodTransfer_Click;
            // 
            // panel2
            // 
            panel2.BackColor = Color.MediumVioletRed;
            panel2.Controls.Add(lblTitle);
            panel2.Dock = DockStyle.Top;
            panel2.Location = new Point(299, 0);
            panel2.Name = "panel2";
            panel2.Size = new Size(841, 55);
            panel2.TabIndex = 1;
            // 
            // lblTitle
            // 
            lblTitle.AutoSize = true;
            lblTitle.Font = new Font("Sylfaen", 16F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblTitle.ForeColor = Color.White;
            lblTitle.Location = new Point(209, 5);
            lblTitle.Name = "lblTitle";
            lblTitle.Size = new Size(459, 42);
            lblTitle.TabIndex = 3;
            lblTitle.Text = "Blood Bank Management System";
            // 
            // pbMainImage
            // 
            pbMainImage.Image = (Image)resources.GetObject("pbMainImage.Image");
            pbMainImage.Location = new Point(319, 62);
            pbMainImage.Name = "pbMainImage";
            pbMainImage.Size = new Size(801, 670);
            pbMainImage.SizeMode = PictureBoxSizeMode.Zoom;
            pbMainImage.TabIndex = 2;
            pbMainImage.TabStop = false;
            // 
            // MainForm
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(1140, 752);
            Controls.Add(pbMainImage);
            Controls.Add(panel2);
            Controls.Add(panel1);
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Form1";
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            panel2.ResumeLayout(false);
            panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)pbMainImage).EndInit();
            ResumeLayout(false);
        }

        #endregion

        private Panel panel1;
        private Panel panel2;
        private Label lblTitle;
        private Label lblBloodTransfer;
        private Label lblViewDonors;
        private Label lblDonor;
        private Label lblBloodStock;
        private Label lblViewPatients;
        private Label lblPatient;
        private Label lblDashboard;
        private Label lblLogout;
        private PictureBox pbMainImage;
        private Label label1;
    }
}