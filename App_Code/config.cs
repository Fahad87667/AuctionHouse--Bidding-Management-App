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
/// Summary description for config
/// </summary>
public class config
{
   // SqlConnection con;
    //config= new SqlConnection(@"Data Source=OWNER-253EA4333;Initial Catalog=eShop;Integrated Security=True");
//    SqlConnection con;
    public SqlConnection getconnection()
    {
        return new SqlConnection(@"Data Source=OWNER-253EA4333;Initial Catalog=eshop;Integrated Security=True");
    }
}
