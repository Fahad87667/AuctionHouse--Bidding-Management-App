<%@ Page Language="C#" MasterPageFile="~/eShop/Site.master" AutoEventWireup="true" CodeFile="catalog.aspx.cs" Inherits="Default2" Title="Untitled Page" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">
    .style1
    {
        height: 14px;
    }
        .style2
        {
            height: 101px;
        }
        .style3
        {
            height: 31px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <table style="width: 100%; height: 310px;">
        <tr>
            <td class="style1">
                <br />
            </td>
        </tr>
        <tr align=center>
            <td>
                <asp:DataList ID="DataList1" runat="server" DataKeyField="category" 
                    DataSourceID="SqlDataSource1" 
                    onselectedindexchanged="DataList1_SelectedIndexChanged1" 
                    onitemcommand="DataList1_ItemCommand" RepeatColumns="3" 
                    RepeatDirection="Horizontal">
                    <ItemTemplate>
                        <table style="width: 100%; height: 125px;">
                            <tr>
                                <td class="style2">
                                    <asp:Image ID="Image1" runat="server" Height="120px" 
                                        ImageUrl='<%# Eval("image") %>' Width="143px" />
                                </td>
                            </tr>
                            <tr>
                                <td class="style3">
                                    <asp:LinkButton ID="LinkButton6" runat="server" Text='<%# Eval("category") %>'></asp:LinkButton>
                                </td>
                            </tr>
                        </table>
                        <br />
                    </ItemTemplate>
                </asp:DataList>
                <asp:SqlDataSource ID="SqlDataSource1" runat="server" 
                    ConnectionString="Data Source=DRULES-PC;Initial Catalog=eshop;Integrated Security=True" 
                    ProviderName="System.Data.SqlClient" SelectCommand="SELECT * FROM [category]">
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
    <asp:ListBox ID="ListBox1" runat="server" Height="102px" Width="194px"></asp:ListBox>
</asp:Content>

