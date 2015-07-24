
var IPAM_object={
    data:function(){
        
        
        
    },
    //get data in 11.22.33.44/23 format
    init:function(sub){
      
        s=sub.split('/')
        this.IPv4_Address(s[0],s[1],true)  
        
    },
    
    binMask:function(){
        
        
    },
    
    //calculate significant num [a][b][c][d]
    significant:function(){
      
       
        if (this.netmaskBits<32)   {
            m=[0,0,0,1]
            
        }
       
        if (this.netmaskBits<24)   {
            m=[0,0,1,1]
            
        }
        
        if (this.netmaskBits<16)   {
            m=[0,1,1,1]
            
        }
        if (this.netmaskBits<8)   {
            m=[1,1,1,1]
            
        }
       
        
        
        
        return m;
        
    },
    
    isIpFromSubnet:function(ip){
        intadr=this.IPv4_dotquadA_to_intA(ip);
        
        if(intadr>=this.addressInteger && intadr<=(this.addressInteger+this.hostTot)) return true;
        return false;
        
    },
    //calculate all hosts
    hosts:function(){
        
        hosts=[]
        
        for(i=0;i<this.hostTot+2;i++){
            hosts.push(this.IPv4_intA_to_dotquadA(this.addressInteger+i))
            
        }
        return hosts;
        
        
        
        
        
    },
    IPv4_Address:function( addressDotQuad, netmaskBits ,is_network) {
        var split = addressDotQuad.split( '.', 4 );
        var byte1 = Math.max( 0, Math.min( 255, parseInt( split[0] ))); /* sanity check: valid values: = 0-255 */
        var byte2 = Math.max( 0, Math.min( 255, parseInt( split[1] )));
        var byte3 = Math.max( 0, Math.min( 255, parseInt( split[2] )));
        var byte4 = Math.max( 0, Math.min( 255, parseInt( split[3] )));
        // if(is_network)  byte4=0;
        if( isNaN( byte1 )) {
            byte1 = 0;
        }	/* fix NaN situations */
        if( isNaN( byte2 )) {
            byte2 = 0;
        }
        if( isNaN( byte3 )) {
            byte3 = 0;
        }
        if( isNaN( byte4 )) {
            byte4 = 0;
        }
        addressDotQuad = ( byte1 +'.'+ byte2 +'.'+ byte3 +'.'+ byte4 );

        this.addressDotQuad = addressDotQuad.toString();
        this.netmaskBits = Math.max( 0, Math.min( 32, parseInt( netmaskBits ))); /* sanity check: valid values: = 0-32 */
	
        this.addressInteger = this.IPv4_dotquadA_to_intA( this.addressDotQuad );
        this.addressDotQuad  = this.IPv4_intA_to_dotquadA( this.addressInteger );
        this.addressBinStr  = this.IPv4_intA_to_binstrA( this.addressInteger );
	
        this.netmaskBinStr  = this.IPv4_bitsNM_to_binstrNM( this.netmaskBits );
        this.netmaskInteger = this.IPv4_binstrA_to_intA( this.netmaskBinStr );
        this.netmaskDotQuad  = this.IPv4_intA_to_dotquadA( this.netmaskInteger );
	
        //network address 
        this.netaddressBinStr = this.IPv4_Calc_netaddrBinStr( this.addressBinStr, this.netmaskBinStr );
        this.netaddressInteger = this.IPv4_binstrA_to_intA( this.netaddressBinStr );
        this.netaddressDotQuad  = this.IPv4_intA_to_dotquadA( this.netaddressInteger );
	
        
        //broadcast address
        this.netbcastBinStr = this.IPv4_Calc_netbcastBinStr( this.addressBinStr, this.netmaskBinStr );
        this.netbcastInteger = this.IPv4_binstrA_to_intA( this.netbcastBinStr );
        this.netbcastDotQuad  = this.IPv4_intA_to_dotquadA( this.netbcastInteger );
        
        //total hosts
        this.hostTot=Math.pow(2,32-this.netmaskBits)-2
        
        
    },

    /* In some versions of JavaScript subnet calculators they use bitwise operations to shift the values left. Unfortunately JavaScript converts to a 32-bit signed integer when you mess with bits, which leaves you with the sign + 31 bits. For the first byte this means converting back to an integer results in a negative value for values 128 and higher since the leftmost bit, the sign, becomes 1. Using the 64-bit float allows us to display the integer value to the user. */
    /* dotted-quad IP to integer */
    IPv4_dotquadA_to_intA:function ( strbits ) {
        var split = strbits.split( '.', 4 );
        var myInt = (
            parseFloat( split[0] * 16777216 )	/* 2^24 */
            + parseFloat( split[1] * 65536 )		/* 2^16 */
            + parseFloat( split[2] * 256 )		/* 2^8  */
            + parseFloat( split[3] )
            );
        return myInt;
    },

    /* integer IP to dotted-quad */
    IPv4_intA_to_dotquadA:function ( strnum ) {
        var byte1 = ( strnum >>> 24 );
        var byte2 = ( strnum >>> 16 ) & 255;
        var byte3 = ( strnum >>>  8 ) & 255;
        var byte4 = strnum & 255;
        return ( byte1 + '.' + byte2 + '.' + byte3 + '.' + byte4 );
    },

    /* integer IP to binary string representation */
    IPv4_intA_to_binstrA:function ( strnum ) {
        var numStr = strnum.toString( 2 ); /* Initialize return value as string */
        var numZeros = 32 - numStr.length; /* Calculate no. of zeros */
        if (numZeros > 0) {
            for (var i = 1; i <= numZeros; i++) {
                numStr = "0" + numStr
            }
        } 
        return numStr;
    },

    /* binary string IP to integer representation */
    IPv4_binstrA_to_intA:function ( binstr ) {
        return parseInt( binstr, 2 );
    },

    /* convert # of bits to a string representation of the binary value */
    IPv4_bitsNM_to_binstrNM:function ( bitsNM ) {
        var bitString = '';
        var numberOfOnes = bitsNM;
        while( numberOfOnes-- ) bitString += '1'; /* fill in ones */
        numberOfZeros = 32 - bitsNM;
        while( numberOfZeros-- ) bitString += '0'; /* pad remaining with zeros */
        return bitString;
    },

    /* The IPv4_Calc_* functions operate on string representations of the binary value because I don't trust JavaScript's sign + 31-bit bitwise functions. */
    /* logical AND between address & netmask */
    IPv4_Calc_netaddrBinStr:function ( addressBinStr, netmaskBinStr ) {
        var netaddressBinStr = '';
        var aBit = 0;
        var nmBit = 0;
        for( pos = 0; pos < 32; pos ++ ) {
            aBit = addressBinStr.substr( pos, 1 );
            nmBit = netmaskBinStr.substr( pos, 1 );
            if( aBit == nmBit ) {
                netaddressBinStr += aBit.toString();
            }
            else{
                netaddressBinStr += '0';
            }
        }
        return netaddressBinStr;
    },

    /* logical OR between address & NOT netmask */
    IPv4_Calc_netbcastBinStr:function ( addressBinStr, netmaskBinStr ) {
        var netbcastBinStr = '';
        var aBit = 0;
        var nmBit = 0;
        for( pos = 0; pos < 32; pos ++ ) {
            aBit = parseInt( addressBinStr.substr( pos, 1 ));
            nmBit = parseInt( netmaskBinStr.substr( pos, 1 ));
		
            if( nmBit ) {
                nmBit = 0;
            }	/* flip netmask bits */
            else{
                nmBit = 1;
            }
		
            if( aBit || nmBit ) {
                netbcastBinStr += '1'
            }
            else{
                netbcastBinStr += '0';
            }
        }
        return netbcastBinStr;
    },

    /* included as an example alternative for converting 8-bit bytes to an integer in IPv4_dotquadA_to_intA */
    IPv4_BitShiftLeft:function( mask, bits ) {
        return ( mask * Math.pow( 2, bits ) );
    },

    /* used for display purposes */
    IPv4_BinaryDotQuad:function ( binaryString ) {
        return ( binaryString.substr( 0, 8 ) +'.'+ binaryString.substr( 8, 8 ) +'.'+ binaryString.substr( 16, 8 ) +'.'+ binaryString.substr( 24, 8 ) );
    }
    
    
    
}