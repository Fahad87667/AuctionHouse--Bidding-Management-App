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

/// <summary>
/// Summary description for Class1
/// </summary>
public class Class1
{
    public DataTable dt;
    public Class1()
    {
        dt = new DataTable("cart");
        dt.Columns.Add("id", typeof(Int32));
        dt.Columns["id"].AutoIncrement = true;
        dt.Columns["id"].AutoIncrementSeed = 1;
        dt.Columns.Add("pid", typeof(string));
        dt.Columns.Add("pname", typeof(string));
        dt.Columns.Add("qty", typeof(Int32));
        dt.Columns.Add("price", typeof(Int32));
        dt.Columns.Add("img", typeof(string));
        //
        // TODO: Add constructor logic here
        //
    }

}
