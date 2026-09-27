# Computer Networks — Exam-Ready Notes

## OSI Model
The OSI reference model has seven layers: Physical, Data Link, Network, Transport, Session, Presentation and Application. Physical transmits bits; Data Link handles frames and MAC addressing; Network provides logical addressing and routing; Transport provides end-to-end delivery; Session manages sessions; Presentation handles translation, encryption and compression; Application provides network services to applications.

## TCP/IP Model
The TCP/IP architecture commonly uses Application, Transport, Internet and Network Access layers. TCP is connection-oriented and provides reliable ordered delivery. UDP is connectionless with lower overhead. IP provides logical addressing and routing but does not itself guarantee delivery.

## IPv4 vs IPv6
IPv4 uses 32-bit addresses and is commonly written in dotted decimal form. IPv6 uses 128-bit addresses and hexadecimal notation. IPv6 provides a vastly larger address space, supports efficient hierarchical addressing and uses Neighbor Discovery instead of ARP. IPv6 also simplifies some header functions and supports automatic configuration mechanisms.

## ARP vs RARP
ARP maps an IPv4 address to a MAC address on a local network. RARP was designed to obtain an IP address from a MAC address and has largely been replaced by BOOTP and DHCP. ARP is used during local delivery when the destination MAC is unknown.

## LAN basics
A LAN connects devices within a limited geographic area. Ethernet is a common LAN technology. A switch forwards frames using MAC addresses, while a router connects different IP networks. Common topologies include star, bus, ring and mesh.

### Important exam questions
1. Draw and explain all seven OSI layers.
2. Compare OSI and TCP/IP models.
3. Differentiate IPv4 and IPv6.
4. Explain ARP and RARP.
5. Explain switch, router and LAN topology.
