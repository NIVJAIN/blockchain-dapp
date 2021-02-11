pragma solidity >=0.4.21 <0.7.0;
// pragma experimental ABIEncoderV2;
pragma experimental ABIEncoderV2;

contract SmartContract {
    struct CompanyDetails {
        bytes32 cName;
        bytes32 cEmail;
        string pdf_filename;
        // bytes32 pdf_filename_bytes;
        bytes32 date;
        bytes32 pdf_hash;
    }
    bytes32 public fooStore;
    bytes32[] public EMAIL_LIST;
    struct pdfvalidationList {
        bytes32[] CompanyDetails;
    }
    struct User {
        //jain@gmail.com
        bytes32 uEmail;
        // namejain
        bytes32 uName; 
        // mapping(bytes32 => pdfvalidationList) pdfMapping;
        // mapping('pdf_filename' => [{jarvis,jarvis@gmail.com,pdf_filename,'dateunix'}])
        // mapping(bytes32 => pdfvalidationList) pdfMapping;
        // mapping(bytes32 => CompanyDetails[]) pdfMapping;
        // mapping(bytes32 =pdf_hash => CompanyDetails[]) pdfMapping;
        mapping(bytes32 => CompanyDetails) pdfMapping;
        string [] pdf_list;
        // bytes32 [] pdf_list_bytes;
        bytes32 [] pdf_hashes;
    }
    mapping (bytes32 => User) public usersMap;

    function checkUserExistEmail(bytes32 _email) public view returns(bool success){
        if (keccak256(abi.encodePacked(usersMap[_email].uEmail)) == keccak256(abi.encodePacked(_email))) {
            return (true);
        }
        return (false) ;
    }

    function verifyPdfHash(bytes32 _email, bytes32 _pdf_hash) public view returns(bool success){
        if (keccak256(abi.encodePacked(usersMap[_email].pdfMapping[_pdf_hash].pdf_hash)) == keccak256(abi.encodePacked(_pdf_hash))) {
            return (true);
        }
        return (false) ;
    }
    function register(bytes32 _email, bytes32 _name) public  returns (bool exists) {
        if (keccak256(abi.encodePacked(usersMap[_email].uEmail)) == keccak256(abi.encodePacked(_email))) {
        //    return (false);
           revert();
        }
        usersMap[_email].uEmail = _email;
        usersMap[_email].uName = _name;
        EMAIL_LIST.push(_email);
        return true;
    }

    function getInfo(bytes32 _email) public view returns (bytes32, bytes32){
        return (usersMap[_email].uEmail, usersMap[_email].uName);
    }
    //function addPdfTxn(bytes32 _email, bytes32 _cname, bytes32 _cemail,string memory _pdf_filename,bytes32 _pdf_filename_bytes,bytes32 _pdf_hash, bytes32 _date) public returns (uint256) {
     function addPdfTxn(bytes32 _email, bytes32 _cname, bytes32 _cemail,string memory _pdf_filename,bytes32 _pdf_hash, bytes32 _date) public returns (uint256) {
        if (keccak256(abi.encodePacked(usersMap[_email].uEmail)) != keccak256(abi.encodePacked(_email))) {
        //    return 0;
           revert();
        }
        if (keccak256(abi.encodePacked(usersMap[_email].pdfMapping[_pdf_hash].pdf_hash)) == keccak256(abi.encodePacked(_pdf_hash))) {
            revert();
        }
        // usersMap[_email].pdfMapping[_pdf_filename].push(CompanyDetails(_cname,_cemail,_pdf_filename,_date));
        usersMap[_email].pdfMapping[_pdf_hash].cName = _cname;
        usersMap[_email].pdfMapping[_pdf_hash].cEmail = _cemail;
        usersMap[_email].pdfMapping[_pdf_hash].pdf_filename = _pdf_filename;
        usersMap[_email].pdfMapping[_pdf_hash].date = _date;
        usersMap[_email].pdfMapping[_pdf_hash].pdf_hash = _pdf_hash;
        usersMap[_email].pdf_list.push(_pdf_filename);
        usersMap[_email].pdf_hashes.push(_pdf_hash);
        // usersMap[_email].pdf_list_bytes.push(_pdf_filename_bytes);
        return 1;
    }
    function getPDFList(bytes32 _email) public view returns(string[] memory){
        return (usersMap[_email].pdf_list);
    }

    // function getPDFListBytes(bytes32 _email) public view returns(bytes32 [] memory){
    //     return (usersMap[_email].pdf_list_bytes);
    // }
    
    function getPdfHashes(bytes32 _email) public view returns(bytes32 [] memory){
        return (usersMap[_email].pdf_hashes);
    }

    function getCompanyDetails(bytes32 _email, bytes32 _pdf_hash ) public view returns(bytes32,bytes32,string memory,bytes32,bytes32){
        return(
            usersMap[_email].pdfMapping[_pdf_hash].cName,
            usersMap[_email].pdfMapping[_pdf_hash].cEmail,
            usersMap[_email].pdfMapping[_pdf_hash].pdf_filename,
            // usersMap[_email].pdfMapping[_pdf_hash].pdf_filename_bytes,
            usersMap[_email].pdfMapping[_pdf_hash].date,
            usersMap[_email].pdfMapping[_pdf_hash].pdf_hash);
    }
    // event logFoo(bytes32 foo);
    function sendFoo(bytes32 foo) public {
        fooStore= foo;
        // logFoo(foo);
    }
    function getFoo() public view returns(bytes32) {
        return(fooStore);
    }
}

















    // function getCompany(bytes32 date) public view returns(bytes32[], uint256[], uint256[], bytes32[], bytes32[]){
    //     bytes32[] memory emailids = new bytes32[](length);
    //     bytes32[] memory company = new bytes32[](length);
    //     for(uint i=0; i<EMAIL_LIST.length; i++){
    //         // Namecards memory questionStructs;
    //         nama[i] = questionStructs[addressList[i]].name;
    //         netsize[i] = questionStructs[addressList[i]].contactList[date].emailArray.length;
    //         totaltokens[i] = balanceOf(questionStructs[addressList[i]].ethaddress);
    //         emailids[i] = questionStructs[addressList[i]].emailid;
    //         company[i] = questionStructs[addressList[i]].companyname;
    //     }
    //     return(nama,netsize,totaltokens, emailids, company);
    // }
    // function getPdfTxn(bytes32 _email, bytes32 _cemail) public returns (bytes32[]) {
    //     if (keccak256(abi.encodePacked(usersMap[_email].uEmail)) != keccak256(abi.encodePacked(_email))) {revert();}
    //     return (usersMap[_email].pdfMapping[_cemail].CompanyDetails);
    // }

    //    function getPdfList(bytes32 _email, bytes32 _cemail) public view returns(bytes32[] memory){
    //     return (usersMap[_email].pdfMapping[_cemail].CompanyDetails);
    // }

    // function addPdfTxn(bytes32 _email, bytes32 _cname, bytes32 _cemail,bytes32 _pdf_filename, bytes32 _date) public returns (uint256) {
    //     if (keccak256(abi.encodePacked(usersMap[_email].uEmail)) != keccak256(abi.encodePacked(_email))) {
    //        return 0;
    //     }
    //     // usersMap[_email].pdfMapping[_cemail].cEmail = _cemail;
    //     usersMap[_email].pdfMapping[_cemail].push(CompanyDetails(_cname,_cemail,_pdf_filename,_date));
    //     return 1;
    // }



// pragma solidity 0.5.1;

// contract Certificates {

//     struct Cert {
//         address recipient;
//         bool confirmed;
//     }

//     mapping(bytes32 => Cert) public certs;
//     bytes32[] public certList;

//     event LogNewCert(address sender, bytes32 cert, address recipient);
//     event LogConfirmed(address sender, bytes32 cert);

//     function isCert(bytes32 cert) public view returns(bool isIndeed) {
//         if(cert == 0) return false;
//         return certs[cert].recipient != address(0);
//     }

//     function createCert(bytes32 cert, address recipient) public {
//         require(recipient != address(0));
//         require(!isCert(cert));
//         Cert storage c = certs[cert];
//         c.recipient = recipient;
//         certList.push(cert);
//         emit LogNewCert(msg.sender, cert, recipient);
//     }

//     function confirmCert(bytes32 cert) public {
//         require(certs[cert].recipient == msg.sender);
//         require(certs[cert].confirmed == false);
//         certs[cert].confirmed = true;
//         emit LogConfirmed(msg.sender, cert);
//     }

//     function isUserCert(bytes32 cert, address user) public view returns(bool) {
//         if(!isCert(cert)) return false;
//         if(certs[cert].recipient != user) return false;
//         return certs[cert].confirmed;
//     }
// }