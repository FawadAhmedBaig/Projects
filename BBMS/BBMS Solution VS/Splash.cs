using System.Data.SqlClient;

namespace BBMS
{
    public partial class Splash : Form
    {
        public Splash()
        {
            InitializeComponent();
        }
        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams handleParams = base.CreateParams;
                handleParams.ExStyle |= 0x02000000;
                return handleParams;
            }
        }
        private void Splash_Load(object sender, EventArgs e)
        {
            timer1.Start();
            if (!CheckDatabaseExist())
            {
                GenerateDatabase();
                insertBGroups();
            }
        }

        private void insertBGroups()
        {
            try
            {

                SqlConnection con = new SqlConnection();
                con.ConnectionString = "Data Source=.\\sqlexpress;Initial Catalog=BBMS Database; Integrated Security=True";
                String query = "INSERT INTO BloodTbl (BGroup, BStock) VALUES ('A+', 0),('O+', 0),('B+', 0),('AB+', 0),('A-', 0),('O-', 0),('B-', 0),('AB-', 0);";
                SqlCommand com = new SqlCommand();
                com.Connection = con;
                com.CommandText = query;
                con.Open();
                com.ExecuteNonQuery();
                con.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        int startPos = 0;
        private void timer1_Tick(object sender, EventArgs e)
        {
            startPos++;
            LoadingProgress.Value = startPos;
            if (LoadingProgress.Value == 100)
            {
                LoadingProgress.Value -= 100;
                timer1.Stop();
                Login login = new Login();
                login.Show();
                this.Hide();
            }
        }

        private bool CheckDatabaseExist()
        {
            SqlConnection Connection = new SqlConnection(@"Data Source=.\sqlexpress;Initial Catalog=BBMS Database;Integrated Security=True");
            try
            {
                Connection.Open();
                return true;
            }
            catch
            {
                return false;
            }
        }

        private void GenerateDatabase()
        {
            List<string> cmds = new List<string>();
            if (File.Exists(Application.StartupPath + "\\Script.sql"))
            {
                using (TextReader tr = new StreamReader(Application.StartupPath + "\\Script.sql"))
                {
                    string line = "";
                    string cmd = "";
                    while ((line = tr.ReadLine()) != null)
                    {
                        if (line.Trim().ToUpper() == "GO")
                        {
                            cmds.Add(cmd);
                            cmd = "";
                        }
                        else
                        {
                            cmd += line + "\r\n";
                        }
                    }
                    if (cmd.Length > 0)
                    {
                        cmds.Add(cmd);
                        cmd = "";
                    }
                }

                if (cmds.Count > 0)
                {
                    SqlCommand command = new SqlCommand();
                    command.Connection = new SqlConnection(@"Data Source=.\sqlexpress;Initial Catalog=MASTER;Integrated Security=True");
                    command.CommandType = System.Data.CommandType.Text;
                    command.Connection.Open();
                    for (int i = 0; i < cmds.Count; i++)
                    {
                        command.CommandText = cmds[i];
                        command.ExecuteNonQuery();
                    }
                }
            }
        }

    }
}

