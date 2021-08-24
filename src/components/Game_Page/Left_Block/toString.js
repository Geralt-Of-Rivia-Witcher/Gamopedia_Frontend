function toString(array)
{
    try
    {
        var string = "";
        array.map((element) =>
        {
            return string += element.name + ", ";
        })
        if(string.length === 0)
        {
            string = "Not Available";
        }
        return string.substring(0, string.length - 2);
    } 
    catch (error)
    {
        if(array === null)
        {
            return "Not Available";
        }
        else if(array.length > 10)
        {
            return array.substring(0, 10);
        }
        else
        {
            return array;
        }
    }
    
}

export default toString;