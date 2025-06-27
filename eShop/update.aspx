<%@ Page Language="C#" MasterPageFile="~/eShop/Site.master" AutoEventWireup="true" CodeFile="update.aspx.cs" Inherits="Default2" Title="Untitled Page" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">
        .style1
        {
            width: 100%;
            margin-right: 0px;
        }
        .style3
        {
            height: 57px;
        }
        .style4
        {
            height: 57px;
            width: 436px;
        }
        .style2
        {
        }
        .style5
        {
            height: 52px;
        }
        .style11
        {
            height: 50px;
        }
        .style12
        {
            height: 80px;
            width: 436px;
        }
        .style7
        {
            height: 53px;
        }
        .style9
        {
            height: 54px;
        }
        .style14
        {
            height: 80px;
        }
        </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <div>
    
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <asp:Label ID="Label1" runat="server" Font-Bold="True" Font-Size="XX-Large" 
            Text="Update Your Detail"></asp:Label>
        <br />
        <asp:Label ID="Label2" runat="server" Font-Size="Large" Text="darshu1888gang"></asp:Label>
        <br />
        <br />
        <table class="style1">
            <tr>
                <td class="style3">
                    First Name<br />
                    <asp:TextBox ID="TextBox17" runat="server" Height="22px" Width="240px"></asp:TextBox>
                    &nbsp;</td>
                <td class="style4">
                    Last Name<br />
                    <asp:TextBox ID="TextBox18" runat="server" Height="22px" Width="240px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="style2" colspan="2">
                    Street Address<br />
                    <asp:TextBox ID="TextBox19" runat="server" Height="60px" TextMode="MultiLine" 
                        Width="240px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="style5" colspan="2">
                    City<br />
                    <asp:TextBox ID="TextBox20" runat="server" Height="22px" Width="240px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="style3" colspan="2">
                    State<br />
                    <asp:TextBox ID="TextBox21" runat="server" Height="22px" Width="240px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="style14">
                    Country<br />
                    <asp:TextBox ID="TextBox22" runat="server" Height="22px" Width="240px"></asp:TextBox>
                </td>
                <td class="style12">
                    <br />
                    Postal Code<br />
                    <asp:TextBox ID="TextBox32" runat="server" Height="22px" Width="240px"></asp:TextBox>
                    &nbsp;
                    <asp:RegularExpressionValidator ID="RegularExpressionValidator3" runat="server" 
                        ControlToValidate="TextBox32" ErrorMessage="Enter Valid Postal code" 
                        ValidationExpression="\d{6}"></asp:RegularExpressionValidator>
                </td>
            </tr>
            <tr>
                <td class="style7" colspan="2">
                    Mobile number<br />
                    <asp:TextBox ID="TextBox23" runat="server" Height="22px" Width="240px"></asp:TextBox>
                    &nbsp;<asp:RegularExpressionValidator ID="RegularExpressionValidator2" 
                        runat="server" ControlToValidate="TextBox23" 
                        ErrorMessage="Enter the valid mobile no." ValidationExpression="\d{10}"></asp:RegularExpressionValidator>
                </td>
            </tr>
            <tr>
                <td class="style5" colspan="2">
                    Old E-mail Address<br />
                    <asp:TextBox ID="TextBox24" runat="server" Height="22px" Width="240px"></asp:TextBox>
                    <asp:RegularExpressionValidator ID="RegularExpressionValidator4" runat="server" 
                        ControlToValidate="TextBox24" ErrorMessage="E-mail  Address not valid" 
                        ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"></asp:RegularExpressionValidator>
                </td>
            </tr>
            <tr>
                <td class="style9" colspan="2">
                    New E-Mail Address<br />
                    <asp:TextBox ID="TextBox25" runat="server" Height="22px" Width="240px"></asp:TextBox>
                    <asp:RegularExpressionValidator ID="RegularExpressionValidator5" runat="server" 
                        ErrorMessage="E-mail Address Not valid" ControlToValidate="TextBox25" 
                        ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"></asp:RegularExpressionValidator>
                </td>
            </tr>
            <tr>
                <td class="style5" colspan="2">
                    Conferm E-mail Address<br />
                    <asp:TextBox ID="TextBox26" runat="server" Height="22px" Width="240px"></asp:TextBox>
                    <asp:CompareValidator ID="CompareValidator1" runat="server" 
                        ControlToCompare="TextBox25" ControlToValidate="TextBox26" 
                        ErrorMessage="Check E-mail Address"></asp:CompareValidator>
                    <br />
                    <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" 
                        ControlToValidate="TextBox26" ErrorMessage="The Eimail Address Not valid" 
                        ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"></asp:RegularExpressionValidator>
                </td>
            </tr>
            <tr>
                <td class="style7" colspan="2">
                    Old Password<br />
                    <asp:TextBox ID="TextBox27" runat="server" Height="22px" Width="240px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="style11" colspan="2">
                    New Password<br />
                    <asp:TextBox ID="TextBox28" runat="server" Height="22px" Width="240px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="style5" colspan="2">
                    Conferm Password<br />
                    <asp:TextBox ID="TextBox29" runat="server" Height="22px" Width="240px"></asp:TextBox>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <asp:CompareValidator ID="CompareValidator2" runat="server" 
                        ControlToCompare="TextBox28" ControlToValidate="TextBox29" 
                        ErrorMessage="Check Password"></asp:CompareValidator>
                </td>
            </tr>
            <tr>
                <td class="style5" colspan="2">
                    Secret Question<br />
                    <asp:TextBox ID="TextBox30" runat="server" Height="22px" Width="240px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="style5" colspan="2">
                    Your Answer<br />
                    <asp:TextBox ID="TextBox31" runat="server" Height="22px" Width="240px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="style2" colspan="2">
                    Date of birth<br />MM/DD/YYYY<br />
                    <asp:DropDownList ID="DropDownList1" runat="server">
                        <asp:ListItem>Select Month</asp:ListItem>
                        <asp:ListItem>Jan</asp:ListItem>
                        <asp:ListItem>Feb</asp:ListItem>
                        <asp:ListItem>Mar</asp:ListItem>
                        <asp:ListItem>Apr</asp:ListItem>
                        <asp:ListItem>May</asp:ListItem>
                        <asp:ListItem>Jun</asp:ListItem>
                        <asp:ListItem>Jul</asp:ListItem>
                        <asp:ListItem>Aug</asp:ListItem>
                        <asp:ListItem>Sep</asp:ListItem>
                        <asp:ListItem>Oct</asp:ListItem>
                        <asp:ListItem>Nov</asp:ListItem>
                        <asp:ListItem>Dec</asp:ListItem>
                    </asp:DropDownList>
                    &nbsp;&nbsp;
                    <asp:DropDownList ID="DropDownList2" runat="server">
                        <asp:ListItem>Select Date</asp:ListItem>
                        <asp:ListItem>1</asp:ListItem>
                        <asp:ListItem>2</asp:ListItem>
                        <asp:ListItem>3</asp:ListItem>
                        <asp:ListItem>4</asp:ListItem>
                        <asp:ListItem>5</asp:ListItem>
                        <asp:ListItem>6</asp:ListItem>
                        <asp:ListItem>7</asp:ListItem>
                        <asp:ListItem>8</asp:ListItem>
                        <asp:ListItem>9</asp:ListItem>
                        <asp:ListItem>10</asp:ListItem>
                        <asp:ListItem>11</asp:ListItem>
                        <asp:ListItem>12</asp:ListItem>
                        <asp:ListItem>13</asp:ListItem>
                        <asp:ListItem>14</asp:ListItem>
                        <asp:ListItem>15</asp:ListItem>
                        <asp:ListItem>16</asp:ListItem>
                        <asp:ListItem>17</asp:ListItem>
                        <asp:ListItem>18</asp:ListItem>
                        <asp:ListItem>19</asp:ListItem>
                        <asp:ListItem>20</asp:ListItem>
                        <asp:ListItem>21</asp:ListItem>
                        <asp:ListItem>22</asp:ListItem>
                        <asp:ListItem>23</asp:ListItem>
                        <asp:ListItem>24</asp:ListItem>
                        <asp:ListItem>25</asp:ListItem>
                        <asp:ListItem>26</asp:ListItem>
                        <asp:ListItem>27</asp:ListItem>
                        <asp:ListItem>28</asp:ListItem>
                        <asp:ListItem>29</asp:ListItem>
                        <asp:ListItem>30</asp:ListItem>
                        <asp:ListItem>31</asp:ListItem>
                    </asp:DropDownList>
                    &nbsp;
                    <asp:TextBox ID="TextBox16" runat="server" Width="76px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="style2" colspan="2" width=>
                    <asp:CheckBox ID="CheckBox1" runat="server" 
                        oncheckedchanged="CheckBox1_CheckedChanged" 
                        Text="I agree to Update my detail" />
                    </td>
            </tr>
            <tr align=center>
                <td class="style2" colspan="2" align=center>
                    &nbsp;<asp:ImageButton ID="ImageButton1" runat="server" Height="26px" 
                        ImageUrl="~/eShop/img/buttons/EditGiftRegistry.gif" Width="128px" 
                        onclick="ImageButton1_Click" />
                    &nbsp;</td>
            </tr>
            
        </table>
        <br />
        <br />
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="SpecialContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="Cart" Runat="Server">
</asp:Content>

