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

public partial class Default3 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!this.IsPostBack)

            // Create a random code and store it in the Session object.

            this.Session["CaptchaImageText"] = GenerateRandomCode();

        else
        {
            // On a postback, check the user input.

            if (this.CodeNumberTextBox.Text == this.Session["CaptchaImageText"].ToString())
            {
                // Display an informational message.

                Response.Redirect("Default.aspx");
            }
            else
            {
                // Display an error message.

                this.MessageLabel.CssClass = "error";
                this.MessageLabel.Text = "ERROR: Incorrect, try again.";

                // Clear the input and create a new random code.

                this.CodeNumberTextBox.Text = "";
                this.Session["CaptchaImageText"] = GenerateRandomCode();
            }
        }
    }
    protected void TextBox8_TextChanged(object sender, EventArgs e)
    {

    }
    protected void ImageButton1_Click(object sender, ImageClickEventArgs e)
    {
        config c = new config();
        SqlConnection con = c.getconnection();
        SqlCommand com=new SqlCommand("insert into udetails values('"+TextBox11.Text+"','"+TextBox1.Text+"','"+TextBox2.Text+"','"+(DropDownList1.SelectedValue.ToString()+"/"+DropDownList2.SelectedValue.ToString()+"/"+TextBox16.Text).ToString()+"','"+TextBox3.Text+"','"+TextBox4.Text+"','"+TextBox5.Text+"',"+Convert.ToInt64( TextBox7.Text)+","+Convert.ToInt64( TextBox8.Text)+",'"+TextBox14.Text+"','"+TextBox15.Text+"','"+TextBox9.Text+"')",con);
        con.Open();
        if (con.State == ConnectionState.Open)
        {
            com.ExecuteNonQuery();
            com.CommandText = "insert into login values('" + TextBox11.Text + "','" + TextBox12.Text + "','user')";
            com.ExecuteNonQuery();
        }
        con.Close();
    }

    protected void TextBox16_TextChanged(object sender, EventArgs e)
    {

    }

    private string GenerateRandomCode()
    {
        string s = "";
        Random random = new Random();
        int length = 8;
        for (int i = 0; i < length; i++)
        {
            if (random.Next(0, 4) == 0) //if random.Next() == 0 then we generate a random character
            {
                s += ((char)random.Next(97, 122)).ToString();
            }
            else if (random.Next(0, 3) == 1) //if random.Next() == 0 then we generate a random digit
            {
                s += random.Next(0, 9);
            }
            else
            {
                s += ((char)random.Next(65, 90)).ToString();
            }

        }
        return s;
    }


}
