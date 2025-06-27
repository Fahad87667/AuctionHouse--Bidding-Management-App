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
    SqlConnection con;
    SqlCommand com;
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void Button1_Click(object sender, EventArgs e)
    {string s=@"~\img\category\"+FileUpload1.FileName;
        FileUpload1.PostedFile.SaveAs(Server.MapPath(s));
        con = new SqlConnection(@"Data Source=owner-253ea4333\sqlexpress;Initial Catalog=eShop;Integrated Security=True");//ok
        con.Open();
        com = new SqlCommand("insert into category values('" + TextBox1.Text + "','" + s + "')", con);
        if(con.State==ConnectionState.Open)
        {
            com.ExecuteNonQuery();       
     
        }
        
    }
}
