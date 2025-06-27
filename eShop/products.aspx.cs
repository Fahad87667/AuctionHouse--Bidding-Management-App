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
using System.Data.SqlClient;
public partial class Default2 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            bind_cart();
            if (!IsPostBack)
            {
                string cat = Request.QueryString["catname"].ToString();
            }
        }
        catch (Exception e1)
        {

        }
    }
    protected void ImageButton1_Click(object sender, ImageClickEventArgs e)
    {
    }
    public static void addtocart(string pid, string pname, int qty, int price, string img)
    {
        bool ismatch = false;
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
        dt = (DataTable)HttpContext.Current.Session["cart"];
        for (int j = 0; j <= ob.dt.Rows.Count - 1; j++)
        {
            DataRow dr = ob.dt.Rows[j];
            if ((dr["pid"] == pid) && (dr["pname"] == pname))
            {
                dr["qty"] = Convert.ToInt32(dr["qty"]) + qty;
                ismatch = true;
                break;
            }
        }
        if (ismatch == false)
        {
            DataRow ndr = ob.dt.NewRow();
            ndr["pid"] = pid;
            ndr["pname"] = pname;
            ndr["qty"] = qty;
            ndr["price"] = price;
            ndr["img"] = img;
            ob.dt.Rows.Add(ndr);
        }
        HttpContext.Current.Session["cart"] = ob.dt;

    }
    public static int gettotalprice()
    {
        int total = 0;
        Class1 ob = new Class1();
        ob.dt = (DataTable)HttpContext.Current.Session["cart"];
        for (int j = 0; j <= ob.dt.Rows.Count - 1; j++)
        {
            DataRow dr = ob.dt.Rows[j];
            total += (Convert.ToInt32(dr["qty"]) * Convert.ToInt32(dr["price"]));
        }

        return total;
    }
    public static void deleteitem(string pid, string pname)
    {
        int index = 1, i = 1;
        Class1 ob = new Class1();
        ob.dt = (DataTable)HttpContext.Current.Session["cart"];
        for (int j = 0; j <= ob.dt.Rows.Count - 1; j++)
        {
            DataRow dr = ob.dt.Rows[j];
            if (pid == (Convert.ToString(dr["pid"])) && (pname == Convert.ToString(dr["pname"])))
            {
                index = i;
                break;
            }
            i++;
        }
        ob.dt.Rows[index].Delete();

    }
    public static void viewcart()
    {
        Class1 ob = new Class1();
        ob.dt = (DataTable)HttpContext.Current.Session["cart"];
        config c = new config();
        SqlConnection con = c.getconnection();
        SqlDataAdapter dap = new SqlDataAdapter("select * from cart", con);
        DataSet ds = new DataSet();
        dap.Fill(ds, "icart");
        SqlCommandBuilder cmdBldr = new SqlCommandBuilder(dap);
        ds.Tables["icart"].Clear();
        for (int j = 0; j <= ob.dt.Rows.Count - 1; j++)
        {
            DataRow drc = ob.dt.Rows[j];
            DataRow dr = ds.Tables["icart"].NewRow();
            dr[0] = Convert.ToInt32(drc[0]);
            dr[1] = Convert.ToString(drc[1]);
            dr[2] = Convert.ToString(drc[2]);
            dr[3] = Convert.ToInt32(drc[3]);
            dr[4] = Convert.ToInt32(drc[4]);
            dr[5] = Convert.ToString(drc[5]);
            ds.Tables["icart"].Rows.Add(dr);
        }
        dap.Update(ds, "icart");

    }
    protected void DataList1_ItemCommand(object source, DataListCommandEventArgs e)
    {

        LinkButton lb = (LinkButton)e.CommandSource;
        Response.Redirect("productdetails.aspx?proname=" + lb.Text);
    }
    protected void LinkButton6_Click(object sender, EventArgs e)
    {

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
        string str = "";

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
           
            
            int total = gettotalprice();

            str = "_______________________________";
            ListBox1.Items.Add(str);
            str = "Total Amount=  " + total.ToString();

            ListBox1.Items.Add(str);
        }

    }

}
