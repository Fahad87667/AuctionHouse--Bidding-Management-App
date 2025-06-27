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
        Label2.Text = Request.Cookies["username"].Value.ToString();
    }
    protected void CheckBox1_CheckedChanged(object sender, EventArgs e)
    {

    }
    protected void ImageButton1_Click(object sender, ImageClickEventArgs e)
    {
        config c = new config();
        SqlConnection con = c.getconnection();

        SqlCommand com=new SqlCommand("update udetails set fname='"+TextBox17.Text+"',lname='"+TextBox18.Text+"',dob='"+(DropDownList1.SelectedValue.ToString()+"/"+DropDownList2.SelectedValue.ToString()+"/"+TextBox16.Text).ToString()+"',street_address='"+TextBox19.Text+"',city='"+TextBox20.Text+"',state='"+TextBox21.Text+"',pin="+Convert.ToInt64(TextBox32.Text)+",mobile_no="+Convert.ToInt64(TextBox23.Text)+",sec_question='"+TextBox30.Text+"',sec_ans='"+TextBox31.Text+"',email='"+TextBox25.Text+"' where uid='"+Label2.Text+"'",con);
        con.Open();
        if (con.State == ConnectionState.Open)
        {
            com.ExecuteNonQuery();
            com.CommandText = "update login set pwd='" + TextBox28.Text + "' where uid='" + Label2.Text+"'";
            com.ExecuteNonQuery();
        }
    }
}
