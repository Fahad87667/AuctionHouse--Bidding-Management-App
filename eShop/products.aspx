<%@ Page Language="C#" MasterPageFile="~/eShop/Site.master" AutoEventWireup="true" CodeFile="products.aspx.cs" Inherits="Default2" Title="Untitled Page" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">
        .style3
        {
            height: 38px;
        }
        </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <table style="width: 100%; height: 258px;">
        <tr align=center>
            <td class="style3">
                <asp:Label ID="Label1" runat="server" Text="Label"></asp:Label>
            </td>
        </tr>
        <tr align=center>
            <td>
                <asp:Image ID="Image3" runat="server" Height="10px" 
                    ImageUrl="~/eShop/img/buttons/loadingAnimation.gif" Width="395px" />
            </td>
        </tr>
        <tr align=center>
            <td class="style3">
                <asp:Label ID="Label2" runat="server" Text="Product Information" 
                    Font-Bold="True" Font-Size="Medium" Font-Underline="True" ForeColor="#66FFFF"></asp:Label>
            </td>
        </tr>
        <tr align=center>
            <td>
                <asp:Image ID="Image2" runat="server" Height="10px" 
                    ImageUrl="~/eShop/img/buttons/loadingAnimation.gif" Width="395px" />
            </td>
        </tr>
        <tr align=center>
            <td>
                <asp:DataList ID="DataList1" runat="server" DataKeyField="pid" 
                    DataSourceID="SqlDataSource1" CellSpacing="5" 
                    onitemcommand="DataList1_ItemCommand">
                    <ItemTemplate>
                        pid:
                        <asp:Label ID="pidLabel" runat="server" Text='<%# Eval("pid") %>' />
                        <br />
                        pname:
                        <asp:Label ID="pnameLabel" runat="server" Text='<%# Eval("pname") %>' />
                        <br />
                        image:
                        <asp:Image ID="Image3" runat="server" ImageUrl='<%# Eval("image") %>'/>        
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
                    ConnectionString="<%$ ConnectionStrings:eshopConnectionString9 %>" 
                    
                    SelectCommand="SELECT * FROM [products] WHERE ([category] = @category)">
                    <SelectParameters>
                        <asp:QueryStringParameter Name="category" QueryStringField="catname" 
                            Type="String" />
                    </SelectParameters>
                </asp:SqlDataSource>
            </td>
        </tr>
        <tr align=center>
            <td>
                &nbsp;</td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="SpecialContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="Cart" Runat="Server">
    <asp:ListBox ID="ListBox1" runat="server" Height="102px" Width="194px">
</asp:ListBox>
</asp:Content>

