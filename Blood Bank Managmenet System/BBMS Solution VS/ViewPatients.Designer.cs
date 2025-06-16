namespace BBMS
{
    partial class ViewPatients
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
            DataGridViewCellStyle dataGridViewCellStyle1 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle2 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle3 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle4 = new DataGridViewCellStyle();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges4 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ViewPatients));
            label10 = new Label();
            panel2 = new Panel();
            label1 = new Label();
            panel1 = new Panel();
            lblBloodStock = new Label();
            lblViewDonors = new Label();
            panel4 = new Panel();
            lblViewPatient = new Label();
            lblDonate = new Label();
            lblDonor = new Label();
            lblPatient = new Label();
            lblLogout = new Label();
            lblDashboard = new Label();
            lblBloodTransfer = new Label();
            cmbBloodGroup = new ComboBox();
            cmbGender = new ComboBox();
            txtAge = new TextBox();
            txtAddress = new TextBox();
            txtPhone = new TextBox();
            txtName = new TextBox();
            label15 = new Label();
            label14 = new Label();
            label12 = new Label();
            label16 = new Label();
            label13 = new Label();
            label17 = new Label();
            dataGridView1 = new Guna.UI2.WinForms.Guna2DataGridView();
            btnUpdate = new Guna.UI2.WinForms.Guna2TileButton();
            btnDelete = new Guna.UI2.WinForms.Guna2TileButton();
            panel2.SuspendLayout();
            panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)dataGridView1).BeginInit();
            SuspendLayout();
            // 
            // label10
            // 
            label10.AutoSize = true;
            label10.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label10.ForeColor = Color.Red;
            label10.Location = new Point(656, 68);
            label10.Name = "label10";
            label10.Size = new Size(193, 47);
            label10.TabIndex = 13;
            label10.Text = "Donors List";
            // 
            // panel2
            // 
            panel2.BackColor = Color.MediumVioletRed;
            panel2.Controls.Add(label1);
            panel2.Dock = DockStyle.Top;
            panel2.Location = new Point(299, 0);
            panel2.Name = "panel2";
            panel2.Size = new Size(841, 55);
            panel2.TabIndex = 12;
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
            // panel1
            // 
            panel1.BackColor = Color.Crimson;
            panel1.Controls.Add(lblBloodStock);
            panel1.Controls.Add(lblViewDonors);
            panel1.Controls.Add(panel4);
            panel1.Controls.Add(lblViewPatient);
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
            panel1.TabIndex = 11;
            // 
            // lblBloodStock
            // 
            lblBloodStock.AutoSize = true;
            lblBloodStock.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblBloodStock.ForeColor = Color.White;
            lblBloodStock.Location = new Point(40, 419);
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
            lblViewDonors.Location = new Point(40, 209);
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
            panel4.Location = new Point(20, 342);
            panel4.Name = "panel4";
            panel4.Size = new Size(14, 53);
            panel4.TabIndex = 6;
            // 
            // lblViewPatient
            // 
            lblViewPatient.AutoSize = true;
            lblViewPatient.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblViewPatient.ForeColor = Color.White;
            lblViewPatient.Location = new Point(40, 347);
            lblViewPatient.Name = "lblViewPatient";
            lblViewPatient.Size = new Size(231, 47);
            lblViewPatient.TabIndex = 5;
            lblViewPatient.Text = "View Patients";
            // 
            // lblDonate
            // 
            lblDonate.AutoSize = true;
            lblDonate.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblDonate.ForeColor = Color.White;
            lblDonate.Location = new Point(40, 135);
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
            lblDonor.Location = new Point(40, 68);
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
            lblPatient.Location = new Point(40, 279);
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
            lblDashboard.Location = new Point(40, 559);
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
            lblBloodTransfer.Location = new Point(40, 489);
            lblBloodTransfer.Name = "lblBloodTransfer";
            lblBloodTransfer.Size = new Size(243, 47);
            lblBloodTransfer.TabIndex = 3;
            lblBloodTransfer.Text = "Blood Transfer";
            lblBloodTransfer.Click += lblBloodTransfer_Click;
            // 
            // cmbBloodGroup
            // 
            cmbBloodGroup.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            cmbBloodGroup.ForeColor = Color.Red;
            cmbBloodGroup.FormattingEnabled = true;
            cmbBloodGroup.Items.AddRange(new object[] { "A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-" });
            cmbBloodGroup.Location = new Point(590, 303);
            cmbBloodGroup.Name = "cmbBloodGroup";
            cmbBloodGroup.Size = new Size(225, 39);
            cmbBloodGroup.TabIndex = 37;
            // 
            // cmbGender
            // 
            cmbGender.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            cmbGender.ForeColor = Color.Red;
            cmbGender.FormattingEnabled = true;
            cmbGender.Items.AddRange(new object[] { "Male", "Female", "Other" });
            cmbGender.Location = new Point(330, 303);
            cmbGender.Name = "cmbGender";
            cmbGender.Size = new Size(225, 39);
            cmbGender.TabIndex = 36;
            // 
            // txtAge
            // 
            txtAge.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            txtAge.ForeColor = Color.Red;
            txtAge.Location = new Point(590, 192);
            txtAge.Name = "txtAge";
            txtAge.Size = new Size(225, 39);
            txtAge.TabIndex = 35;
            // 
            // txtAddress
            // 
            txtAddress.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            txtAddress.ForeColor = Color.Red;
            txtAddress.Location = new Point(849, 305);
            txtAddress.Multiline = true;
            txtAddress.Name = "txtAddress";
            txtAddress.Size = new Size(258, 37);
            txtAddress.TabIndex = 34;
            // 
            // txtPhone
            // 
            txtPhone.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            txtPhone.ForeColor = Color.Red;
            txtPhone.Location = new Point(849, 192);
            txtPhone.Name = "txtPhone";
            txtPhone.Size = new Size(258, 39);
            txtPhone.TabIndex = 33;
            // 
            // txtName
            // 
            txtName.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            txtName.ForeColor = Color.Red;
            txtName.Location = new Point(321, 192);
            txtName.Name = "txtName";
            txtName.Size = new Size(234, 39);
            txtName.TabIndex = 32;
            // 
            // label15
            // 
            label15.AutoSize = true;
            label15.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label15.ForeColor = Color.Red;
            label15.Location = new Point(586, 258);
            label15.Name = "label15";
            label15.Size = new Size(141, 31);
            label15.TabIndex = 30;
            label15.Text = "Blood Group";
            // 
            // label14
            // 
            label14.AutoSize = true;
            label14.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label14.ForeColor = Color.Red;
            label14.Location = new Point(323, 258);
            label14.Name = "label14";
            label14.Size = new Size(88, 31);
            label14.TabIndex = 29;
            label14.Text = "Gender";
            // 
            // label12
            // 
            label12.AutoSize = true;
            label12.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label12.ForeColor = Color.Red;
            label12.Location = new Point(584, 147);
            label12.Name = "label12";
            label12.Size = new Size(53, 31);
            label12.TabIndex = 28;
            label12.Text = "Age";
            // 
            // label16
            // 
            label16.AutoSize = true;
            label16.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label16.ForeColor = Color.Red;
            label16.Location = new Point(849, 260);
            label16.Name = "label16";
            label16.Size = new Size(95, 31);
            label16.TabIndex = 27;
            label16.Text = "Address";
            // 
            // label13
            // 
            label13.AutoSize = true;
            label13.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label13.ForeColor = Color.Red;
            label13.Location = new Point(843, 147);
            label13.Name = "label13";
            label13.Size = new Size(77, 31);
            label13.TabIndex = 26;
            label13.Text = "Phone";
            // 
            // label17
            // 
            label17.AutoSize = true;
            label17.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label17.ForeColor = Color.Red;
            label17.Location = new Point(324, 147);
            label17.Name = "label17";
            label17.Size = new Size(73, 31);
            label17.TabIndex = 31;
            label17.Text = "Name";
            // 
            // dataGridView1
            // 
            dataGridViewCellStyle1.BackColor = Color.White;
            dataGridViewCellStyle1.ForeColor = Color.White;
            dataGridViewCellStyle1.SelectionBackColor = Color.White;
            dataGridView1.AlternatingRowsDefaultCellStyle = dataGridViewCellStyle1;
            dataGridViewCellStyle2.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = Color.Red;
            dataGridViewCellStyle2.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            dataGridViewCellStyle2.ForeColor = Color.White;
            dataGridViewCellStyle2.SelectionBackColor = Color.Red;
            dataGridViewCellStyle2.SelectionForeColor = SystemColors.HighlightText;
            dataGridViewCellStyle2.WrapMode = DataGridViewTriState.True;
            dataGridView1.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle2;
            dataGridView1.ColumnHeadersHeight = 29;
            dataGridView1.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.EnableResizing;
            dataGridViewCellStyle3.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = Color.White;
            dataGridViewCellStyle3.Font = new Font("Sylfaen", 12F);
            dataGridViewCellStyle3.ForeColor = Color.White;
            dataGridViewCellStyle3.SelectionBackColor = Color.Crimson;
            dataGridViewCellStyle3.SelectionForeColor = Color.White;
            dataGridViewCellStyle3.WrapMode = DataGridViewTriState.False;
            dataGridView1.DefaultCellStyle = dataGridViewCellStyle3;
            dataGridView1.GridColor = Color.FromArgb(231, 229, 255);
            dataGridView1.Location = new Point(323, 448);
            dataGridView1.Name = "dataGridView1";
            dataGridView1.RowHeadersVisible = false;
            dataGridView1.RowHeadersWidth = 62;
            dataGridViewCellStyle4.ForeColor = Color.Red;
            dataGridViewCellStyle4.SelectionBackColor = Color.Crimson;
            dataGridView1.RowsDefaultCellStyle = dataGridViewCellStyle4;
            dataGridView1.RowTemplate.DefaultCellStyle.ForeColor = Color.Red;
            dataGridView1.RowTemplate.DefaultCellStyle.SelectionBackColor = Color.Crimson;
            dataGridView1.Size = new Size(805, 292);
            dataGridView1.TabIndex = 40;
            dataGridView1.ThemeStyle.AlternatingRowsStyle.BackColor = Color.White;
            dataGridView1.ThemeStyle.AlternatingRowsStyle.Font = null;
            dataGridView1.ThemeStyle.AlternatingRowsStyle.ForeColor = Color.Empty;
            dataGridView1.ThemeStyle.AlternatingRowsStyle.SelectionBackColor = Color.Empty;
            dataGridView1.ThemeStyle.AlternatingRowsStyle.SelectionForeColor = Color.Empty;
            dataGridView1.ThemeStyle.BackColor = Color.White;
            dataGridView1.ThemeStyle.GridColor = Color.FromArgb(231, 229, 255);
            dataGridView1.ThemeStyle.HeaderStyle.BackColor = Color.Red;
            dataGridView1.ThemeStyle.HeaderStyle.BorderStyle = DataGridViewHeaderBorderStyle.None;
            dataGridView1.ThemeStyle.HeaderStyle.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            dataGridView1.ThemeStyle.HeaderStyle.ForeColor = Color.White;
            dataGridView1.ThemeStyle.HeaderStyle.HeaightSizeMode = DataGridViewColumnHeadersHeightSizeMode.EnableResizing;
            dataGridView1.ThemeStyle.HeaderStyle.Height = 29;
            dataGridView1.ThemeStyle.ReadOnly = false;
            dataGridView1.ThemeStyle.RowsStyle.BackColor = Color.White;
            dataGridView1.ThemeStyle.RowsStyle.BorderStyle = DataGridViewCellBorderStyle.SingleHorizontal;
            dataGridView1.ThemeStyle.RowsStyle.Font = new Font("Sylfaen", 12F);
            dataGridView1.ThemeStyle.RowsStyle.ForeColor = Color.FromArgb(71, 69, 94);
            dataGridView1.ThemeStyle.RowsStyle.Height = 33;
            dataGridView1.ThemeStyle.RowsStyle.SelectionBackColor = Color.Crimson;
            dataGridView1.ThemeStyle.RowsStyle.SelectionForeColor = Color.White;
            dataGridView1.CellContentClick += dataGridView1_CellContentClick_2;
            dataGridView1.KeyDown += dataGridView1_KeyDown;
            // 
            // btnUpdate
            // 
            btnUpdate.BackColor = Color.Transparent;
            btnUpdate.BorderColor = Color.ForestGreen;
            btnUpdate.BorderRadius = 25;
            btnUpdate.BorderThickness = 1;
            btnUpdate.CustomizableEdges = customizableEdges1;
            btnUpdate.DisabledState.BorderColor = Color.DarkGray;
            btnUpdate.DisabledState.CustomBorderColor = Color.DarkGray;
            btnUpdate.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnUpdate.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnUpdate.FillColor = Color.ForestGreen;
            btnUpdate.Font = new Font("Segoe UI", 11F);
            btnUpdate.ForeColor = Color.White;
            btnUpdate.HoverState.BorderColor = Color.Transparent;
            btnUpdate.HoverState.FillColor = Color.Green;
            btnUpdate.Location = new Point(519, 369);
            btnUpdate.Name = "btnUpdate";
            btnUpdate.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btnUpdate.Size = new Size(167, 52);
            btnUpdate.TabIndex = 41;
            btnUpdate.Text = "&Update";
            btnUpdate.Click += btnSave_Click;
            // 
            // btnDelete
            // 
            btnDelete.BackColor = Color.Transparent;
            btnDelete.BorderColor = Color.Red;
            btnDelete.BorderRadius = 25;
            btnDelete.BorderThickness = 1;
            btnDelete.CustomizableEdges = customizableEdges3;
            btnDelete.DisabledState.BorderColor = Color.DarkGray;
            btnDelete.DisabledState.CustomBorderColor = Color.DarkGray;
            btnDelete.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnDelete.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnDelete.FillColor = Color.Red;
            btnDelete.Font = new Font("Segoe UI", 11F);
            btnDelete.ForeColor = Color.White;
            btnDelete.HoverState.BorderColor = Color.Transparent;
            btnDelete.HoverState.FillColor = Color.Crimson;
            btnDelete.Location = new Point(753, 369);
            btnDelete.Name = "btnDelete";
            btnDelete.ShadowDecoration.CustomizableEdges = customizableEdges4;
            btnDelete.Size = new Size(167, 52);
            btnDelete.TabIndex = 42;
            btnDelete.Text = "&Delete";
            btnDelete.Click += btnDelete_Click_1;
            // 
            // ViewPatients
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(1140, 752);
            Controls.Add(btnDelete);
            Controls.Add(btnUpdate);
            Controls.Add(dataGridView1);
            Controls.Add(cmbBloodGroup);
            Controls.Add(cmbGender);
            Controls.Add(txtAge);
            Controls.Add(txtAddress);
            Controls.Add(txtPhone);
            Controls.Add(txtName);
            Controls.Add(label15);
            Controls.Add(label14);
            Controls.Add(label12);
            Controls.Add(label16);
            Controls.Add(label13);
            Controls.Add(label17);
            Controls.Add(label10);
            Controls.Add(panel2);
            Controls.Add(panel1);
            ForeColor = Color.White;
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "ViewPatients";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "ViewPatients";
            //Load += ViewPatients_Load;
            panel2.ResumeLayout(false);
            panel2.PerformLayout();
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)dataGridView1).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private TextBox textBox1;
        private Label label11;
        private Label label10;
        private Panel panel2;
        private Label label1;
        private Panel panel1;
        private Label lblBloodStock;
        private Label lblViewDonors;
        private Panel panel4;
        private Label lblViewPatient;
        private Label lblDonor;
        private Label lblPatient;
        private Label lblLogout;
        private Label lblDashboard;
        private Label lblBloodTransfer;
        private ComboBox cmbBloodGroup;
        private ComboBox cmbGender;
        private TextBox txtAge;
        private TextBox txtAddress;
        private TextBox txtPhone;
        private TextBox txtName;
        private Label label15;
        private Label label14;
        private Label label12;
        private Label label16;
        private Label label13;
        private Label label17;
        private Label lblDonate;
        private Guna.UI2.WinForms.Guna2DataGridView dataGridView1;
        private Guna.UI2.WinForms.Guna2TileButton btnUpdate;
        private Guna.UI2.WinForms.Guna2TileButton btnDelete;
    }
}