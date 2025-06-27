<%@ Page Language="C#" MasterPageFile="~/eShop/Site.master" AutoEventWireup="true" CodeFile="signup.aspx.cs" Inherits="Default3" Title="Untitled Page" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <style type="text/css">


        .style1
        {
            width: 434px;
        }
        .style4
        {
            width: 428px;
            text-align: left;
        }
        .style5
        {
            width: 428px;
            text-align: left;
            height: 96px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <table cellpadding="4" cellspacing="4" class="style1">
        <tr>
            <td class="style4">
                    First Name<br />
                <asp:TextBox ID="TextBox1" runat="server" Width="248px"></asp:TextBox>
                    &nbsp;</td>
        </tr>
        <tr>
            <td class="style4">
                Last Name<br />
                <asp:TextBox ID="TextBox2" runat="server" Height="22px" Width="240px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Street Address<br />
                <asp:TextBox ID="TextBox3" runat="server" Height="57px" TextMode="MultiLine" 
                        Width="245px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style5">
                    City<br />
                <asp:TextBox ID="TextBox4" runat="server" Height="22px" Width="242px"></asp:TextBox>
                    &nbsp;</td>
        </tr>
        <tr>
            <td class="style4">
                    State<br />
                <asp:TextBox ID="TextBox5" runat="server" Height="22px" Width="242px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Country<br />
                <asp:TextBox ID="TextBox6" runat="server" Height="22px" Width="242px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Postal Code<br />
                <asp:TextBox ID="TextBox7" runat="server" Height="22px" Width="242px"></asp:TextBox>
                <br />
                <asp:RegularExpressionValidator ID="RegularExpressionValidator3" runat="server" 
                        ControlToValidate="TextBox7" ErrorMessage="Postal Code not valid" 
                        ValidationExpression="\d{6}"></asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Mobile Number<br />
                <asp:TextBox ID="TextBox8" runat="server" Height="22px" Width="242px" 
                        ontextchanged="TextBox8_TextChanged"></asp:TextBox>
                    &nbsp;
                    <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" 
                        ControlToValidate="TextBox8" ErrorMessage="Enter Valid mobile no. " 
                        ValidationExpression="\d{10}"></asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    E-mail Address<br />
                <asp:TextBox ID="TextBox9" runat="server" Height="22px" Width="242px"></asp:TextBox>
                    &nbsp;<asp:RegularExpressionValidator ID="RegularExpressionValidator2" 
                        runat="server" ControlToValidate="TextBox9" 
                        ErrorMessage="E-mail address not vailid" 
                        ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"></asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Conferm E-mail Address<br />
                <asp:TextBox ID="TextBox10" runat="server" Height="22px" Width="242px"></asp:TextBox>
                <asp:CompareValidator ID="CompareValidator2" runat="server" 
                        ControlToCompare="TextBox9" ControlToValidate="TextBox10" 
                        ErrorMessage="E-mail id not match"></asp:CompareValidator>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Choose Your Id<br />
                <asp:TextBox ID="TextBox11" runat="server" Height="22px" Width="242px"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                        ControlToValidate="TextBox11" ErrorMessage="RequiredFieldValidator">Enter
                    </asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Your Password<br />
                <asp:TextBox ID="TextBox12" runat="server" Height="22px" Width="242px" 
                        TextMode="Password"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Conferm Password<br />
                <asp:TextBox ID="TextBox13" runat="server" Height="22px" Width="242px" 
                        TextMode="Password"></asp:TextBox>
                <asp:CompareValidator ID="CompareValidator1" runat="server" 
                        ControlToCompare="TextBox12" ControlToValidate="TextBox13" 
                        ErrorMessage="Password  Not Match"></asp:CompareValidator>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Secrete Question<br />
                <asp:TextBox ID="TextBox14" runat="server" Height="22px" Width="242px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Your Answer<br />
                <asp:TextBox ID="TextBox15" runat="server" Height="22px" Width="242px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style4">
                    Date of Birth
                    <br />MM/DD/YYYY<br />
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
                    &nbsp;
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
                    <asp:TextBox ID="TextBox16" runat="server" Width="76px" 
                        ontextchanged="TextBox16_TextChanged"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="style4">
                                              
    
        <asp:Image runat="server" src="JpegImage.aspx" alt="Captcha" >
                        </asp:Image><br/>
      <p>
        <strong>Enter the code shown above:</strong><br/>
        <asp:TextBox id="CodeNumberTextBox" runat="server"></asp:TextBox>
        <asp:Button id="SubmitButton" runat="server" Text="Refresh">
        </asp:Button><br/>
      </p>
      <p>
        <em>
          (Note: If you cannot read the numbers in the above<br/>
          image, reload the page to generate a new one.)
        </em>
      </p>
      <asp:Label id="MessageLabel" runat="server"></asp:Label>

    
    

                &nbsp;</td>
        </tr>
        <tr>
            <td class="style4">
                <br />
                <asp:CheckBox ID="CheckBox1" runat="server" Text="I Agree for Register" />
                    </td>
        </tr>
        <tr align=center>
            <td class="style4" align=center>
            <asp:ImageButton ID="ImageButton1" runat="server" Height="19px" 
                        ImageUrl="~/eShop/img/buttons/Register.gif" onclick="ImageButton1_Click" 
                        Width="111px" BorderStyle="None" ImageAlign="Middle" />
            </td>
        </tr>
        <tr>
            <td class="style4">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="SpecialContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="Cart" Runat="Server">
</asp:Content>

