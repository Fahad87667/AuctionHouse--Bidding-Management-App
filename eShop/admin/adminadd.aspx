<%@ Page Language="C#"  MasterPageFile="~/eShop/Site.master" AutoEventWireup="true" CodeFile="adminadd.aspx.cs" Inherits="Default2" Title="Untitled Page" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">
        .style1
        {
        }
        .style2
        {
            height: 31px;
        }
        .style3
        {
            height: 31px;
        }
        .style4
        {
            width: 175px;
            height: 13px;
        }
        .style5
        {
            height: 13px;
        }
        .style6
        {
            width: 175px;
            height: 44px;
        }
        .style7
        {
            height: 44px;
        }
        .style8
        {
            width: 175px;
            height: 93px;
        }
        .style9
        {
            height: 93px;
        }
        .style10
        {
            height: 72px;
        }
        .style11
        {
            height: 31px;
            width: 175px;
        }
        .style12
        {
            width: 175px;
        }
        .style13
        {
            height: 72px;
            width: 175px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <table align="center" style="width: 100%; height: 415px;">
        <tr>
            <td class="style2" colspan="2" align=center>
            <marquee BEHAVIOR=ALTERNATE style="width: 448px">
                <asp:Label ID="Label9" runat="server" Text="ADD PRODUCTS TO DATABASE" 
                    Font-Bold="True" Font-Italic="True" Font-Size="Large" Font-Underline="True" 
                    ForeColor="#FF3300"></asp:Label></marquee>
            </td>
        </tr>
        <tr>
            <td class="style11">
                &nbsp;&nbsp;
                <asp:Label ID="Label1" runat="server" Text="Enter the product Id"></asp:Label>
                :</td>
            <td  class="style3" valign="middle">
                <asp:TextBox ID="TextBox1" runat="server" Width="230px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style4">
                &nbsp;&nbsp;
                <asp:Label ID="Label2" runat="server" Text="Enter Product Name"></asp:Label>
                :</td>
            <td  class="style5">
                <asp:TextBox ID="TextBox2" runat="server" Width="230px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style12">
                &nbsp;&nbsp;
                <asp:Label ID="Label3" runat="server" Text="Enter Product Image"></asp:Label>
            </td>
            <td>
                <asp:FileUpload ID="FileUpload1" runat="server" Width="240px" />
            </td>
        </tr>
        <tr>
            <td class="style6">
                &nbsp;&nbsp;
                <asp:Label ID="Label4" runat="server" Text="Enter Comany:"></asp:Label>
            </td>
            <td  class="style7">
                <asp:TextBox ID="TextBox3" runat="server" Width="230px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style8" >
                &nbsp;&nbsp;
                <asp:Label ID="Label5" runat="server" Text="Enter Details:"></asp:Label>
            </td>
            <td class="style9">
                <asp:TextBox ID="TextBox4" runat="server" Height="121px" TextMode="MultiLine" 
                    Width="251px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style13">
                &nbsp;&nbsp;
                <asp:Label ID="Label6" runat="server" Text="Select Category"></asp:Label>
            </td>
            <td class="style10">
                <asp:DropDownList ID="DropDownList1" runat="server" 
                    DataSourceID="SqlDataSource1" DataTextField="category" 
                    DataValueField="category" Height="32px" Width="234px">
                </asp:DropDownList>
                <asp:SqlDataSource ID="SqlDataSource1" runat="server" 
                    ConnectionString="<%$ ConnectionStrings:eshopConnectionString4 %>" 
                    SelectCommand="SELECT [category], [image] FROM [category]">
                </asp:SqlDataSource>
            </td>
        </tr>
        <tr>
            <td class="style12" >
                &nbsp;&nbsp;
                <asp:Label ID="Label7" runat="server" Text="Enter Price:"></asp:Label>
            </td>
            <td >
                <asp:TextBox ID="TextBox6" runat="server" Width="230px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style12" >
                &nbsp;&nbsp;
                <asp:Label ID="Label8" runat="server" Text="Enter the quantity"></asp:Label>
            </td>
            <td >
                <asp:TextBox ID="TextBox7" runat="server" Width="230px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style1" colspan="2" align=center>
                <asp:Button ID="Button1" runat="server" Text="Submit" onclick="Button1_Click" />
                &nbsp;&nbsp;&nbsp;
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="SpecialContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="Cart" Runat="Server">
</asp:Content>

