using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        var headers = Request.Headers.ToString();

        foreach (var key in Request.Headers.AllKeys)
            Response.Write("Header:" + Request.Headers[key] + Environment.NewLine);

    }
}