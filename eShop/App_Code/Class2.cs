using System;
using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Data.SqlClient;

/// <summary>
/// Summary description for Class2
/// </summary>
public class Class2
{
	public Class2()
	{
		//
		// TODO: Add constructor logic here
		//
	}
    public static void addtocart(string pid, string pname, int qty, int price, string img)
    {
        bool ismatch = false;
        Class1 ob = new Class1();
        ob.dt = (DataTable)HttpContext.Current.Session["cart"];
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
        SqlConnection con = new SqlConnection(@"Data Source=owner-253ea4333\sqlexpress;Initial Catalog=eShop;Integrated Security=True");
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


}
