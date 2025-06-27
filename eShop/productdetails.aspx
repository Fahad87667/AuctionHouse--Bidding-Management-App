<%@ Page Language="C#" MasterPageFile="~/eShop/Site.master" AutoEventWireup="true" CodeFile="productdetails.aspx.cs" Inherits="Default2" Title="Untitled Page" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">

        .style4
        {
            height: 44px;
            width: 195px;
        }
        .style7
        {
            height: 44px;
        }
        .style15
        {
            height: 47px;
        }
        .style10
        {
            height: 114px;
        }
        .style16
        {
            height: 25px;
        }
        .style17
        {
            height: 55px;
        }
        .style18
        {
            height: 52px;
        }
        .style6
        {
            width: 195px;
            height: 59px;
        }
        .style19
        {
            height: 59px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <table style="width: 100%; height: 356px;">
        <tr>
            <td class="style1" colspan="3">
                <asp:DataList ID="DataList1" runat="server" DataSourceID="SqlDataSource1" 
                    onitemcommand="DataList1_ItemCommand" DataKeyField="pid">
                    <ItemTemplate>
                        pid:
                        <asp:Label ID="pidLabel" runat="server" Text='<%# Eval("pid") %>' />
                        <br />
                        pname:
                        <asp:Label ID="pnameLabel" runat="server" Text='<%# Eval("pname") %>' />
                        <br />
                        image:
                        <asp:Label ID="imageLabel" runat="server" Text='<%# Eval("image") %>' />
                        <br />
                        comany:
                        <asp:Label ID="comanyLabel" runat="server" Text='<%# Eval("comany") %>' />
                        <br />
                        details:
                        <asp:Label ID="detailsLabel" runat="server" Text='<%# Eval("details") %>' />
                        <br />
                        category:
                        <asp:Label ID="categoryLabel" runat="server" Text='<%# Eval("category") %>' />
                        <br />
                        price:
                        <asp:Label ID="priceLabel" runat="server" Text='<%# Eval("price") %>' />
                        <br />
                        qty:
                        <asp:Label ID="qtyLabel" runat="server" Text='<%# Eval("qty") %>' />
                        <br />
                        <br />
                    </ItemTemplate>
                </asp:DataList>
                <asp:SqlDataSource ID="SqlDataSource1" runat="server" 
                    ConnectionString="<%$ ConnectionStrings:eshopConnectionString7 %>" 
                    SelectCommand="SELECT * FROM [products] WHERE ([pname] = @pname)">
                    <SelectParameters>
                        <asp:QueryStringParameter Name="pname" QueryStringField="proname" 
                            Type="String" />
                    </SelectParameters>
                </asp:SqlDataSource>
            </td>
        </tr>
        <tr>
            <td class="style1">
                    &nbsp;</td>
            <td class="style1">
                    &nbsp;</td>
            <td class="style1">
                    &nbsp;</td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="SpecialContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="Cart" Runat="Server">
</asp:Content>

