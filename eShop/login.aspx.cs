using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Data.SqlClient;

public partial class Default2 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void ImageButton1_Click(object sender, ImageClickEventArgs e)
    {
        int flag = 0;
        config c = new config();
        SqlConnection con = c.getconnection();
        SqlCommand com = new SqlCommand("select * from login", con);
        con.Open();
        if (con.State == ConnectionState.Open)
        {
            SqlDataReader dtr;
            dtr = com.ExecuteReader();
            while (dtr.Read())
            {
                Response.Write(dtr[0].ToString());
                if(dtr[0].ToString().Equals(TextBox1.Text) && dtr[1].ToString().Equals(TextBox2.Text))
                {
                    flag = 1;
                    break;
                }
            }

            if (flag == 1)
            {
                HttpCookie uname = new HttpCookie("username");
                HttpCookie upass = new HttpCookie("userpass");
                HttpCookie rights = new HttpCookie("rights");                
                uname.Value = TextBox1.Text;
                upass.Value = TextBox2.Text;
                rights.Value = dtr[2].ToString();
                Response.Cookies.Add(uname);
                Response.Cookies.Add(upass);
                Response.Cookies.Add(rights);
                Response.Redirect("default.aspx");                     
            }
            
        }
        con.Close();

    }
}
