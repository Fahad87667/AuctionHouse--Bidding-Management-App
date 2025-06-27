<%@ Page Language="C#" MasterPageFile="~/eShop/Site.master" AutoEventWireup="true" CodeFile="login.aspx.cs" Inherits="Default2" Title="Untitled Page" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">
        .style8
        {
            width: 405px;
        }
        .style9
        {
            height: 105px;
            width: 405px;
        }
        .style10
        {
            height: 26px;
        }
        .style11
        {
            height: 26px;
            width: 177px;
        }
        .style12
        {
            width: 177px;
        }
        .style13
        {
            width: 405px;
            height: 33px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    h<table style="width: 100%; height: 306px;">
        <tr>
            <td class="style8" colspan="2">
                &nbsp;</td>
        </tr>
        <tr align=center>
            <td class="style9" align=center colspan="2">
                <table align="center" style="width: 104%; height: 64px;">
                    <tr>
                        <td class="style11" 
                            style="font-family: 'Times New Roman', Times, serif; font-size: medium; font-weight: bold; color: #000000">
                            User Id</td>
                        <td class="style10">
                            <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td class="style12" 
                            style="font-family: 'Times New Roman', Times, serif; font-size: medium; font-weight: bold">
                            Password</td>
                        <td>
                            <asp:TextBox ID="TextBox2" runat="server" TextMode="Password"></asp:TextBox>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td class="style13" align=center colspan="2">
        <asp:ImageButton ID="ImageButton1" runat="server" CommandName="sign in" 
            DescriptionUrl="~/App_Data/Images/Buttons/Login.gif" Height="23px" 
            ImageUrl="~/eShop/img/buttons/Login.gif" Width="101px" 
            onclick="ImageButton1_Click" />
            </td>
        </tr>
        <tr>
            <td class="style8" align=center>
                <asp:HyperLink ID="HyperLink1" runat="server" Font-Bold="True" 
                    Font-Size="Small" ForeColor="#6699FF">Forget Password</asp:HyperLink>
            </td>
            <td class="style8" align=center>
                <asp:HyperLink ID="HyperLink2" runat="server" Font-Bold="True" 
                    Font-Size="Small" ForeColor="#6699FF" NavigateUrl="~/eShop/signup.aspx">New 
                User</asp:HyperLink>
            </td>
        </tr>
        <tr>
            <td class="style8" align=center colspan="2">
        <asp:Image ID="Image2" runat="server" Height="84px" 
            ImageUrl="~/eShop/img/buttons/visa.gif" Width="253px" />
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="SpecialContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="Cart" Runat="Server">
</asp:Content>

