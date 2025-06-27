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
using ClassLibrary2;

public partial class _Default : System.Web.UI.Page
{
   public   string str = "";
    protected void Page_Load(object sender, EventArgs e)
    {
        bind_cart();

    }
    public void bind_cart()
    {
        DataTable dt = new DataTable("cart");
        dt.Columns.Add("id", typeof(Int32));
        dt.Columns["id"].AutoIncrement = true;
        dt.Columns["id"].AutoIncrementSeed = 1;
        dt.Columns.Add("pid", typeof(string));
        dt.Columns.Add("pname", typeof(string));
        dt.Columns.Add("qty", typeof(Int32));
        dt.Columns.Add("price", typeof(Int32));
        dt.Columns.Add("img", typeof(string));
        Class1 ob = new Class1();
        //ob.dt = (DataTable)Session["cart"];
       

        if (ob.dt.Rows.Count == 0)
        {
            str = "_______________________________";

            ListBox1.Items.Add(str);
            str = "No Item Selected";
            ListBox1.Items.Add(str);
            str = "_______________________________";
            ListBox1.Items.Add(str);
        }
        else
        {
            str = "    " + "Product  " + "Quantity";
            ListBox1.Items.Add(str);
            str = "_______________________________";
            ListBox1.Items.Add(str);
            int index = 1;

            for (int j = 0; j <= ob.dt.Rows.Count - 1; j++)
            {
                DataRow dr = ob.dt.Rows[j];
                str = Convert.ToString(index) + ". " + Convert.ToString(dr["pname"]) + "  " + Convert.ToString(dr["qty"]);
                ListBox1.Items.Add(str);
                index++;

            }
        }
    }
    public static int gettotalprice()
    {
        int total = 0;
        Class1 ob = new Class1();
       // ob.dt = (DataTable)HttpContext.Current.Session["cart"];
        
        for (int j = 0; j <= ob.dt.Rows.Count - 1; j++)
        {
            DataRow dr = ob.dt.Rows[j];
            total += (Convert.ToInt32(dr["qty"]) * Convert.ToInt32(dr["price"]));
        }
        
        return total;
    }
            int total = gettotalprice();
   
            //str = "_______________________________";
    
            //ListBox1.Items.Add(str);
            //str = "Total Amount=  " + total.ToString();

            //ListBox1.Items.Add(str);
   

}
