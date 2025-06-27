using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml.Linq;

public partial class Site : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
        try
        {
            
            String s=(Request.Cookies["username"].Value).ToString();
            Panel1.Visible = false;
            Label1.Text = Request.Cookies["username"].Value.ToString();
            Panel2.Visible = true;
           // bind_cart();
            if (Request.Cookies["rights"].Value.ToString() == "admin")
            {
                Panel4.Visible = true;
            }
            else
            {
                Panel4.Visible = false;
            }
            
        }
        catch(Exception ex)
        {
            Panel1.Visible = true;
            Label1.Text = "";
            Panel2.Visible = false;
        }
        }
    protected void LinkButton1_Click(object sender, EventArgs e)
    {       
    
       Response.Redirect("products.aspx?catname="+LinkButton1.Text);
        
    }
    protected void LinkButton2_Click(object sender, EventArgs e)
    {
        
       
       Response.Redirect("products.aspx?catname=" + LinkButton2.Text);
        
             
        
    }
    protected void LinkButton3_Click(object sender, EventArgs e)
    {
        
        
        Response.Redirect("products.aspx?catname=" + LinkButton3.Text);
        
        
       
    }
    protected void LinkButton4_Click(object sender, EventArgs e)
    {
        
        

        Response.Redirect("products.aspx?catname=" + LinkButton4.Text);
    }
    protected void LinkButton5_Click(object sender, EventArgs e)
    {
        

        Response.Redirect("products.aspx?catname=" + LinkButton5.Text);
        
               
    }
    protected void ImageButton1_Click(object sender, ImageClickEventArgs e)
    {

    }
    protected void Menu1_MenuItemClick(object sender, MenuEventArgs e)
    {

    }
    protected void Menu2_MenuItemClick(object sender, MenuEventArgs e)
    {

    }
    protected void ImageButton1_Click1(object sender, ImageClickEventArgs e)
    {
        Response.Redirect("signup.aspx");
    }
    protected void ImageButton2_Click(object sender, ImageClickEventArgs e)
    {
        Response.Redirect("login.aspx");
    }
   
    protected void Button1_Click(object sender, EventArgs e)
    {
        Response.Cookies["username"].Expires = DateTime.Now.AddSeconds(0);
        Response.Cookies["userpass"].Expires = DateTime.Now.AddSeconds(0);
        Response.Cookies["rights"].Expires = DateTime.Now.AddSeconds(0);
       Response.Redirect(@"~/default.aspx");
           
    }
    protected void Menu4_MenuItemClick(object sender, MenuEventArgs e)
    {

    }
    protected void LinkButton6_Click(object sender, EventArgs e)
    {
        Response.Redirect("~/update.aspx");

    }

    
    protected void ListBox1_SelectedIndexChanged(object sender, EventArgs e)
    {

    }
    protected void LinkButton3_Click1(object sender, EventArgs e)
    {
        Response.Redirect("products.aspx?catname=" + LinkButton3.Text);
    }
}
