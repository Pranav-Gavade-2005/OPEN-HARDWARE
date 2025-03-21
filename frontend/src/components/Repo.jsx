import React from 'react'

function Repo() {
    return (
        <div className="" style={{ padding: "10px 40px" }}>
            <div className='h-[300px] w-full bg-amber-50 flex'>
                <div className='w-[20%] h-full bg-blue-200' style={{ padding: "30px" }}>
                    <img src="" alt="" srcset="" />
                    <h1>Repo image</h1>
                </div>
                <div id="repo-content" style={{ paddingTop: "20px", padding: "30px" }}>
                    <h2 className='text-2xl font-bold' >Repo Name</h2>
                    <h2 className='text-xl font-bold' style={{paddingTop: "20px"}}>Project Description:
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil rerum expedita, fugit voluptas, praesentium delectus, tempora possimus quia non et deleniti? Tenetur voluptate eum ullam quam culpa qui iusto similique. </p>
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default Repo