<%@ Page Language="C#" MasterPageFile="~/eShop/Site.master" AutoEventWireup="true" CodeFile="adminaddcat.aspx.cs" Inherits="Default2" Title="Untitled Page" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">
        .style1
        {
        }
        .style3
        {
            height: 56px;
        }
        .style4
        {
            height: 56px;
        }
        .style5
        {
            width: 154px;
            height: 73px;
        }
        .style6
        {
            height: 73px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <table style="width: 91%; height: 227px; margin-left: 20px;">
        <tr>
            <td class="style3" colspan="2" 
                style="font-family: 'Times New Roman', Times, serif; font-size: large; color: #FF0000; font-weight: bold; text-decoration: underline;">
                <marquee behavior=alternate>
                ADD CATEGORY</marquee></td>
        </tr>
        <tr>
            <td class="style3">
                &nbsp;&nbsp;
                ENTER CATEGORY</td>
            <td class="style4">
                <asp:TextBox ID="TextBox1" runat="server" Width="206px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style5">
                &nbsp;&nbsp;
                UPLOAD IMAGE</td>
            <td class="style6">
                <asp:FileUpload ID="FileUpload1" runat="server" Width="231px" />
            </td>
        </tr>
        <tr>
            <td class="style1" colspan="2" align=center>
                <asp:Button ID="Button1" runat="server" Text="SUBMIT" onclick="Button1_Click" />
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="SpecialContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="Cart" Runat="Server">
</asp:Content>

