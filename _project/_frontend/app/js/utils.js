





class Utils
{

	static randomInt(min, max)
	{
		return Math.round(min + (Math.random() * (max-min)));
	}

	static randomFloat(min, max)
	{
		return min + (Math.random() * (max-min));
	}

	static randomElement(array)
	{
		return array[Utils.randomInt(0, array.length-1)];
	}

	static difference(a, b)
	{
		return b - a;
	}

	static leadingZeros(int, chars)
	{
		// return a string of [int] with total length [chars] with leading zeros if necessary
		let string = int+'';
		let output = string;
		if(string.length < chars)
		{
			let c = chars - string.length;
			while(c > 0)
			{
				output = '0'+output;
				c--;
			}
		}
		return output;
	}

	static isEmpty(obj)
	{
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	static stripCRs(string)
	{
		// remove evil new line chars
		return string.replace(/(\r\n|\n|\r)/gm, "");
	}

	static setCharAt(str, index, chr)
	{
		if(index > str.length-1) return str;
		return str.substr(0,index) + chr + str.substr(index+1);
	}

}






