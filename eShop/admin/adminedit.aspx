<%@ Page Language="C#" MasterPageFile="~/eShop/Site.master" AutoEventWireup="true" CodeFile="adminedit.aspx.cs" Inherits="Default2" Title="Untitled Page" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">
        .style3
        {
            height: 37px;
        }
        .style4
        {
            height: 38px;
        }
        .style5
        {
            height: 37px;
            width: 215px;
        }
        .style6
        {
            height: 38px;
            }
        .style7
        {
            height: 351px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <table style="width: 100%; height: 28px;">
        <tr>
            <td class="style5">
                ProductName<asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style7">
                <asp:DetailsView ID="DetailsView1" runat="server" AllowPaging="True" 
                    AutoGenerateRows="False" BackColor="White" BorderColor="#999999" 
                    BorderStyle="Solid" BorderWidth="1px" CellPadding="3" DataKeyNames="pid" 
                    DataSourceID="SqlDataSource1" ForeColor="Black" GridLines="Vertical" 
                    Height="264px" style="margin-top: 0px" Width="393px">
                    <FooterStyle BackColor="#CCCCCC" />
                    <PagerStyle BackColor="#999999" ForeColor="Black" HorizontalAlign="Center" />
                    <Fields>
                        <asp:BoundField DataField="pid" HeaderText="pid" ReadOnly="True" 
                            SortExpression="pid" />
                        <asp:BoundField DataField="pname" HeaderText="pname" SortExpression="pname" />
                        <asp:BoundField DataField="image" HeaderText="image" 
                            SortExpression="image" />
                        <asp:BoundField DataField="company" HeaderText="company" 
                            SortExpression="company" />
                        <asp:BoundField DataField="details" HeaderText="details" 
                            SortExpression="details" />
                        <asp:BoundField DataField="category" HeaderText="category" 
                            SortExpression="category" />
                        <asp:BoundField DataField="price" HeaderText="price" SortExpression="price" />
                        <asp:BoundField DataField="qty" HeaderText="qty" SortExpression="qty" />
                    </Fields>
                    <HeaderStyle BackColor="Black" Font-Bold="True" ForeColor="White" />
                    <EditRowStyle BackColor="#000099" Font-Bold="True" ForeColor="White" />
                    <AlternatingRowStyle BackColor="#CCCCCC" />
                </asp:DetailsView>
                <asp:SqlDataSource ID="SqlDataSource1" runat="server" 
                    ConnectionString="<%$ ConnectionStrings:eshopConnectionString5 %>" 
                    DeleteCommand="DELETE FROM [products] WHERE [pid] = @pid" 
                    
                    InsertCommand="INSERT INTO [products] ([pid], [pname], [image], [company], [details], [category], [price], [qty]) VALUES (@pid, @pname, @image, @company, @details, @category, @price, @qty)" SelectCommand="SELECT * FROM [products] WHERE ([pname] = @pname)" 
                    
                    
                    UpdateCommand="UPDATE [products] SET [pname] = @pname, [image] = @image, [company] = @company, [details] = @details, [category] = @category, [price] = @price, [qty] = @qty WHERE [pid] = @pid">
                    <SelectParameters>
                        <asp:ControlParameter ControlID="TextBox1" Name="pname" PropertyName="Text" 
                            Type="String" />
                    </SelectParameters>
                    <DeleteParameters>
                        <asp:Parameter Name="pid" Type="String" />
                    </DeleteParameters>
                    <UpdateParameters>
                        <asp:Parameter Name="pname" Type="String" />
                        <asp:Parameter Name="image" Type="String" />
                        <asp:Parameter Name="company" Type="String" />
                        <asp:Parameter Name="details" Type="String" />
                        <asp:Parameter Name="category" Type="String" />
                        <asp:Parameter Name="price" Type="Decimal" />
                        <asp:Parameter Name="qty" Type="Decimal" />
                        <asp:Parameter Name="pid" Type="String" />
                    </UpdateParameters>
                    <InsertParameters>
                        <asp:Parameter Name="pid" Type="String" />
                        <asp:Parameter Name="pname" Type="String" />
                        <asp:Parameter Name="image" Type="String" />
                        <asp:Parameter Name="company" Type="String" />
                        <asp:Parameter Name="details" Type="String" />
                        <asp:Parameter Name="category" Type="String" />
                        <asp:Parameter Name="price" Type="Decimal" />
                        <asp:Parameter Name="qty" Type="Decimal" />
                    </InsertParameters>
                </asp:SqlDataSource>
            </td>
        </tr>
        <tr>
            <td>
                <asp:Button ID="Button1" runat="server" onclick="Button1_Click" Text="Button" />
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="SpecialContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="Cart" Runat="Server">
</asp:Content>

