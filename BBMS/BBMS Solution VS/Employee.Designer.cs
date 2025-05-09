namespace BBMS
{
    partial class Employee
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Employee));
            DataGridViewCellStyle dataGridViewCellStyle1 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle2 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle3 = new DataGridViewCellStyle();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges4 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges5 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges6 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            EmpPassTb = new TextBox();
            label17 = new Label();
            label10 = new Label();
            panel3 = new Panel();
            label15 = new Label();
            label1 = new Label();
            label11 = new Label();
            label9 = new Label();
            EmpNameTb = new TextBox();
            pictureBox1 = new PictureBox();
            panel2 = new Panel();
            panel1 = new Panel();
            EmpDGV = new Guna.UI2.WinForms.Guna2DataGridView();
            btnSave = new Guna.UI2.WinForms.Guna2TileButton();
            btnEdit = new Guna.UI2.WinForms.Guna2TileButton();
            btnDelete = new Guna.UI2.WinForms.Guna2TileButton();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            panel2.SuspendLayout();
            panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)EmpDGV).BeginInit();
            SuspendLayout();
            // 
            // EmpPassTb
            // 
            EmpPassTb.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            EmpPassTb.ForeColor = Color.Red;
            EmpPassTb.Location = new Point(781, 597);
            EmpPassTb.Name = "EmpPassTb";
            EmpPassTb.Size = new Size(235, 39);
            EmpPassTb.TabIndex = 1;
            EmpPassTb.KeyDown += EmpPassTb_KeyDown;
            // 
            // label17
            // 
            label17.AutoSize = true;
            label17.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label17.ForeColor = Color.Red;
            label17.Location = new Point(466, 553);
            label17.Name = "label17";
            label17.Size = new Size(73, 31);
            label17.TabIndex = 30;
            label17.Text = "Name";
            // 
            // label10
            // 
            label10.AutoSize = true;
            label10.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label10.ForeColor = Color.Red;
            label10.Location = new Point(621, 67);
            label10.Name = "label10";
            label10.Size = new Size(193, 47);
            label10.TabIndex = 31;
            label10.Text = "Employees ";
            // 
            // panel3
            // 
            panel3.BackColor = SystemColors.Menu;
            panel3.ForeColor = Color.Transparent;
            panel3.Location = new Point(21, 52);
            panel3.Name = "panel3";
            panel3.Size = new Size(14, 53);
            panel3.TabIndex = 6;
            // 
            // label15
            // 
            label15.AutoSize = true;
            label15.Font = new Font("Sylfaen", 12F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label15.ForeColor = Color.Red;
            label15.Location = new Point(781, 553);
            label15.Name = "label15";
            label15.Size = new Size(110, 31);
            label15.TabIndex = 29;
            label15.Text = "Password";
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
            // label11
            // 
            label11.AutoSize = true;
            label11.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label11.ForeColor = Color.White;
            label11.Location = new Point(41, 52);
            label11.Name = "label11";
            label11.Size = new Size(171, 47);
            label11.TabIndex = 5;
            label11.Text = "Employee";
            // 
            // label9
            // 
            label9.AutoSize = true;
            label9.Font = new Font("Sylfaen", 18F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label9.ForeColor = Color.White;
            label9.Location = new Point(74, 665);
            label9.Name = "label9";
            label9.Size = new Size(124, 47);
            label9.TabIndex = 3;
            label9.Text = "Logout";
            label9.Click += label9_Click;
            // 
            // EmpNameTb
            // 
            EmpNameTb.Font = new Font("Sylfaen", 12F, FontStyle.Bold);
            EmpNameTb.ForeColor = Color.Red;
            EmpNameTb.Location = new Point(466, 598);
            EmpNameTb.Name = "EmpNameTb";
            EmpNameTb.Size = new Size(235, 39);
            EmpNameTb.TabIndex = 0;
            EmpNameTb.KeyDown += EmpNameTb_KeyDown;
            // 
            // pictureBox1
            // 
            pictureBox1.Image = (Image)resources.GetObject("pictureBox1.Image");
            pictureBox1.Location = new Point(677, 130);
            pictureBox1.Name = "pictureBox1";
            pictureBox1.Size = new Size(71, 70);
            pictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
            pictureBox1.TabIndex = 33;
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
            panel2.TabIndex = 28;
            // 
            // panel1
            // 
            panel1.BackColor = Color.Crimson;
            panel1.Controls.Add(panel3);
            panel1.Controls.Add(label11);
            panel1.Controls.Add(label9);
            panel1.Dock = DockStyle.Left;
            panel1.ForeColor = Color.White;
            panel1.Location = new Point(0, 0);
            panel1.Name = "panel1";
            panel1.Size = new Size(299, 752);
            panel1.TabIndex = 27;
            // 
            // EmpDGV
            // 
            dataGridViewCellStyle1.BackColor = Color.White;
            EmpDGV.AlternatingRowsDefaultCellStyle = dataGridViewCellStyle1;
            dataGridViewCellStyle2.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = Color.Red;
            dataGridViewCellStyle2.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            dataGridViewCellStyle2.ForeColor = Color.White;
            dataGridViewCellStyle2.SelectionBackColor = Color.Red;
            dataGridViewCellStyle2.SelectionForeColor = SystemColors.HighlightText;
            dataGridViewCellStyle2.WrapMode = DataGridViewTriState.True;
            EmpDGV.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle2;
            EmpDGV.ColumnHeadersHeight = 29;
            EmpDGV.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.EnableResizing;
            dataGridViewCellStyle3.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = Color.White;
            dataGridViewCellStyle3.Font = new Font("Sylfaen", 12F);
            dataGridViewCellStyle3.ForeColor = Color.FromArgb(71, 69, 94);
            dataGridViewCellStyle3.SelectionBackColor = Color.Crimson;
            dataGridViewCellStyle3.SelectionForeColor = Color.White;
            dataGridViewCellStyle3.WrapMode = DataGridViewTriState.False;
            EmpDGV.DefaultCellStyle = dataGridViewCellStyle3;
            EmpDGV.GridColor = Color.FromArgb(231, 229, 255);
            EmpDGV.Location = new Point(321, 212);
            EmpDGV.Name = "EmpDGV";
            EmpDGV.RowHeadersVisible = false;
            EmpDGV.RowHeadersWidth = 62;
            EmpDGV.Size = new Size(807, 328);
            EmpDGV.TabIndex = 41;
            EmpDGV.ThemeStyle.AlternatingRowsStyle.BackColor = Color.White;
            EmpDGV.ThemeStyle.AlternatingRowsStyle.Font = null;
            EmpDGV.ThemeStyle.AlternatingRowsStyle.ForeColor = Color.Empty;
            EmpDGV.ThemeStyle.AlternatingRowsStyle.SelectionBackColor = Color.Empty;
            EmpDGV.ThemeStyle.AlternatingRowsStyle.SelectionForeColor = Color.Empty;
            EmpDGV.ThemeStyle.BackColor = Color.White;
            EmpDGV.ThemeStyle.GridColor = Color.FromArgb(231, 229, 255);
            EmpDGV.ThemeStyle.HeaderStyle.BackColor = Color.Red;
            EmpDGV.ThemeStyle.HeaderStyle.BorderStyle = DataGridViewHeaderBorderStyle.None;
            EmpDGV.ThemeStyle.HeaderStyle.Font = new Font("Sylfaen", 12F, FontStyle.Bold, GraphicsUnit.Point, 0);
            EmpDGV.ThemeStyle.HeaderStyle.ForeColor = Color.White;
            EmpDGV.ThemeStyle.HeaderStyle.HeaightSizeMode = DataGridViewColumnHeadersHeightSizeMode.EnableResizing;
            EmpDGV.ThemeStyle.HeaderStyle.Height = 29;
            EmpDGV.ThemeStyle.ReadOnly = false;
            EmpDGV.ThemeStyle.RowsStyle.BackColor = Color.White;
            EmpDGV.ThemeStyle.RowsStyle.BorderStyle = DataGridViewCellBorderStyle.SingleHorizontal;
            EmpDGV.ThemeStyle.RowsStyle.Font = new Font("Sylfaen", 12F);
            EmpDGV.ThemeStyle.RowsStyle.ForeColor = Color.FromArgb(71, 69, 94);
            EmpDGV.ThemeStyle.RowsStyle.Height = 33;
            EmpDGV.ThemeStyle.RowsStyle.SelectionBackColor = Color.Crimson;
            EmpDGV.ThemeStyle.RowsStyle.SelectionForeColor = Color.White;
            EmpDGV.CellContentClick += EmpDGV_CellContentClick;
            // 
            // btnSave
            // 
            btnSave.BackColor = Color.Transparent;
            btnSave.BorderColor = Color.MediumVioletRed;
            btnSave.BorderRadius = 25;
            btnSave.BorderThickness = 1;
            btnSave.CustomizableEdges = customizableEdges1;
            btnSave.DisabledState.BorderColor = Color.DarkGray;
            btnSave.DisabledState.CustomBorderColor = Color.DarkGray;
            btnSave.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnSave.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnSave.FillColor = Color.MediumVioletRed;
            btnSave.Font = new Font("Segoe UI", 11F);
            btnSave.ForeColor = Color.White;
            btnSave.HoverState.BorderColor = Color.Transparent;
            btnSave.HoverState.FillColor = Color.Crimson;
            btnSave.Location = new Point(415, 681);
            btnSave.Name = "btnSave";
            btnSave.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btnSave.Size = new Size(167, 52);
            btnSave.TabIndex = 42;
            btnSave.Text = "&Save";
            btnSave.Click += btnSave_Click_1;
            // 
            // btnEdit
            // 
            btnEdit.BackColor = Color.Transparent;
            btnEdit.BorderColor = Color.Green;
            btnEdit.BorderRadius = 25;
            btnEdit.BorderThickness = 1;
            btnEdit.CustomizableEdges = customizableEdges3;
            btnEdit.DisabledState.BorderColor = Color.DarkGray;
            btnEdit.DisabledState.CustomBorderColor = Color.DarkGray;
            btnEdit.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnEdit.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnEdit.FillColor = Color.Green;
            btnEdit.Font = new Font("Segoe UI", 11F);
            btnEdit.ForeColor = Color.White;
            btnEdit.HoverState.BorderColor = Color.Transparent;
            btnEdit.HoverState.FillColor = Color.Crimson;
            btnEdit.Location = new Point(647, 681);
            btnEdit.Name = "btnEdit";
            btnEdit.ShadowDecoration.CustomizableEdges = customizableEdges4;
            btnEdit.Size = new Size(167, 52);
            btnEdit.TabIndex = 43;
            btnEdit.Text = "&Edit";
            btnEdit.Click += btnEdit_Click;
            // 
            // btnDelete
            // 
            btnDelete.BackColor = Color.Transparent;
            btnDelete.BorderColor = Color.Red;
            btnDelete.BorderRadius = 25;
            btnDelete.BorderThickness = 1;
            btnDelete.CustomizableEdges = customizableEdges5;
            btnDelete.DisabledState.BorderColor = Color.DarkGray;
            btnDelete.DisabledState.CustomBorderColor = Color.DarkGray;
            btnDelete.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btnDelete.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btnDelete.FillColor = Color.Red;
            btnDelete.Font = new Font("Segoe UI", 11F);
            btnDelete.ForeColor = Color.White;
            btnDelete.HoverState.BorderColor = Color.Transparent;
            btnDelete.HoverState.FillColor = Color.Crimson;
            btnDelete.Location = new Point(876, 681);
            btnDelete.Name = "btnDelete";
            btnDelete.ShadowDecoration.CustomizableEdges = customizableEdges6;
            btnDelete.Size = new Size(167, 52);
            btnDelete.TabIndex = 44;
            btnDelete.Text = "&Delete";
            btnDelete.Click += btnDelete_Click_1;
            // 
            // Employee
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(1140, 752);
            Controls.Add(btnDelete);
            Controls.Add(btnEdit);
            Controls.Add(btnSave);
            Controls.Add(EmpDGV);
            Controls.Add(EmpPassTb);
            Controls.Add(label17);
            Controls.Add(label10);
            Controls.Add(label15);
            Controls.Add(EmpNameTb);
            Controls.Add(pictureBox1);
            Controls.Add(panel2);
            Controls.Add(panel1);
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Margin = new Padding(4, 5, 4, 5);
            Name = "Employee";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Employee";
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            panel2.ResumeLayout(false);
            panel2.PerformLayout();
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)EmpDGV).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private TextBox EmpPassTb;
        private Label label17;
        private Label label10;
        private Panel panel3;
        private Label label15;
        private Label label1;
        private Label label11;
        private Label label9;
        private TextBox EmpNameTb;
        private PictureBox pictureBox1;
        private Panel panel2;
        private Panel panel1;
        private Guna.UI2.WinForms.Guna2DataGridView EmpDGV;
        private Guna.UI2.WinForms.Guna2TileButton btnSave;
        private Guna.UI2.WinForms.Guna2TileButton btnEdit;
        private Guna.UI2.WinForms.Guna2TileButton btnDelete;
    }
}