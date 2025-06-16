
namespace BBMS
{
    partial class Splash
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
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
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            components = new System.ComponentModel.Container();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Splash));
            LoadingProgress = new Guna.UI2.WinForms.Guna2CircleProgressBar();
            pbLogo = new PictureBox();
            lblTitle = new Label();
            timer1 = new System.Windows.Forms.Timer(components);
            LoadingProgress.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)pbLogo).BeginInit();
            SuspendLayout();
            // 
            // LoadingProgress
            // 
            LoadingProgress.BackColor = Color.Transparent;
            LoadingProgress.Controls.Add(pbLogo);
            LoadingProgress.FillColor = Color.FromArgb(200, 213, 218, 223);
            LoadingProgress.FillThickness = 10;
            LoadingProgress.Font = new Font("Segoe UI", 12F);
            LoadingProgress.ForeColor = Color.White;
            LoadingProgress.Location = new Point(230, 122);
            LoadingProgress.Minimum = 0;
            LoadingProgress.Name = "LoadingProgress";
            LoadingProgress.ProgressColor = Color.Red;
            LoadingProgress.ProgressColor2 = Color.Red;
            LoadingProgress.ProgressThickness = 10;
            LoadingProgress.ShadowDecoration.CustomizableEdges = customizableEdges1;
            LoadingProgress.ShadowDecoration.Mode = Guna.UI2.WinForms.Enums.ShadowMode.Circle;
            LoadingProgress.Size = new Size(170, 170);
            LoadingProgress.TabIndex = 0;
            LoadingProgress.Text = "guna2CircleProgressBar1";
            // 
            // pbLogo
            // 
            pbLogo.Image = (Image)resources.GetObject("pbLogo.Image");
            pbLogo.Location = new Point(39, 32);
            pbLogo.Name = "pbLogo";
            pbLogo.Size = new Size(94, 105);
            pbLogo.SizeMode = PictureBoxSizeMode.Zoom;
            pbLogo.TabIndex = 0;
            pbLogo.TabStop = false;
            // 
            // lblTitle
            // 
            lblTitle.AutoSize = true;
            lblTitle.Font = new Font("Sylfaen", 16F, FontStyle.Regular, GraphicsUnit.Point, 0);
            lblTitle.ForeColor = Color.Red;
            lblTitle.Location = new Point(114, 55);
            lblTitle.Name = "lblTitle";
            lblTitle.Size = new Size(459, 42);
            lblTitle.TabIndex = 1;
            lblTitle.Text = "Blood Bank Management System";
            // 
            // timer1
            // 
            timer1.Tick += timer1_Tick;
            // 
            // Splash
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.White;
            ClientSize = new Size(661, 378);
            Controls.Add(lblTitle);
            Controls.Add(LoadingProgress);
            ForeColor = Color.White;
            FormBorderStyle = FormBorderStyle.None;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "Splash";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Form1";
            Load += Splash_Load;
            LoadingProgress.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)pbLogo).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Guna.UI2.WinForms.Guna2CircleProgressBar LoadingProgress;
        private Label lblTitle;
        private PictureBox pbLogo;
        private System.Windows.Forms.Timer timer1;
    }
}
